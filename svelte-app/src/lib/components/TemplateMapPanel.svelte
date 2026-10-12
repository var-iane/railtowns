<script>
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
  import railMapSvg from "$lib/assets/svg/illinois-rail.svg?raw";

  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // use gsap's mapRange utility method to map one value within one range (here, scroll) to a value within another (here, rail path): https://gsap.com/docs/v3/GSAP/UtilityMethods/mapRange()/
  const { mapRange, clamp, pipe } = gsap.utils;

  let { towns = [], updateTownIndex, onFade } = $props();

  // use the below function to find town marker's position on rail path (0-1), then hard-code values. Re-run this if I change the rail map svg
  // function getTownPositionOnPath(townId) {
  //   const townMarker = document.getElementById(townId);
  //   if (!townMarker) return null;

  //   // find the town's marker element in the rail svg and take the center of its bounding box
  //   const svg = railroadPath.ownerSVGElement;
  //   const townBBox = townMarker.getBBox();
  //   const townX = townBBox.x + townBBox.width / 2;
  //   const townY = townBBox.y + townBBox.height / 2;

  //   // find closest point on railroad path: 1) sample railroad path at 101 evenly spaced points of its length (0%, 1%... 100%); 2) measure straight-line distance from each sample point to marker's center, then keep sample with smallest distance; 3) return that sample's fraction (0 to 1) as the town's position on the path
  //   let closestProgress = 0;
  //   let minDistance = Infinity;

  //   for (let i = 0; i <= 100; i++) {
  //     const progress = i / 100;
  //     const pathLength = railroadPath.getTotalLength();
  //     const point = railroadPath.getPointAtLength(progress * pathLength);

  //     const distance = Math.sqrt(
  //       Math.pow(point.x - townX, 2) + Math.pow(point.y - townY, 2)
  //     );

  //     if (distance < minDistance) {
  //       minDistance = distance;
  //       closestProgress = progress;
  //     }
  //   }

  //   return closestProgress;
  // }

  // const townPositions = [
  //   getTownPositionOnPath('town01-chebanse'),
  //   getTownPositionOnPath('town02-onarga'),
  //   getTownPositionOnPath('town03-champaign'),
  //   getTownPositionOnPath('town04-arcola'),
  //   getTownPositionOnPath('town05-neoga'),
  //   getTownPositionOnPath('town06-farina'),
  //   getTownPositionOnPath('town07-centralia'),
  //   getTownPositionOnPath('town08-tamaroa')
  // ];

  // console.log('Town positions along path:', townPositions);

  // once I got the town positions, hard-coded it here
  const townPositions = [0.14, 0.2, 0.33, 0.42, 0.49, 0.61, 0.69, 0.77];
  const firstTownPosition = townPositions[0];
  const lastTownPosition = townPositions.at(-1);

  onMount(() => {
    const railroadPath = document.getElementById("railroad-line");
    if (!railroadPath) return;

    // 10 total sections: 1 intro + 8 towns + 1 end
    const sections = towns.length + 2;
    const introEnd = 1 / sections; // 0.1
    const townsEnd = (sections - 1) / sections; // 0.9
    const endLength = 1 - townsEnd; // 0.1

    // map scroll progress to how much of rail line is drawn
    const railDrawn = (scroll) =>
      scroll < introEnd
        ? mapRange(0, introEnd, 0, firstTownPosition, scroll)
        : scroll < townsEnd
          ? mapRange(
              introEnd,
              townsEnd,
              firstTownPosition,
              lastTownPosition,
              scroll,
            )
          : mapRange(townsEnd, 1, lastTownPosition, 1, scroll);

    // map position on rail line to scroll progress (backwards of middle part above)
    const scrollWhenRailReaches = mapRange(
      firstTownPosition,
      lastTownPosition,
      introEnd,
      townsEnd,
    );

    const narrativeOpacity = pipe(
      mapRange(0, introEnd / 1.5, 1, 0),
      clamp(0, 1),
    );
    const townPanelOpacity = pipe(
      mapRange(townsEnd, townsEnd + endLength / 2, 1, 0),
      clamp(0, 1),
    );

    const ctx = gsap.context(() => {
      gsap.set(railroadPath, { drawSVG: "0%" });

      ScrollTrigger.create({
        trigger: "#scroll-container", // this is a div in page.svelte
        start: "top bottom",
        end: "bottom bottom",
        onUpdate: ({ progress }) => {
          gsap.set(railroadPath, {
            drawSVG: `0% ${railDrawn(progress) * 100}%`,
          });
          onFade?.(narrativeOpacity(progress), townPanelOpacity(progress));
        },
      });

      towns.forEach((town, i) => {
        const marker = document.getElementById(
          `town${String(i + 1).padStart(2, "0")}-${town.name.toLowerCase()}`,
        );
        if (!marker) return;

        const pop = (scale, opacity) =>
          gsap.to(marker, { scale, opacity, duration: 0.3 });
        const activate = () => {
          pop(1.2, 1);
          updateTownIndex(i);
        };

        const triggerAt = scrollWhenRailReaches(townPositions[i]);
        gsap.set(marker, { scale: 0.5, opacity: 0 });

        ScrollTrigger.create({
          trigger: "#scroll-container",
          start: `${triggerAt * 100}% bottom`,
          end: `${(triggerAt + 0.05) * 100}% bottom`,
          onEnter: activate,
          onEnterBack: activate,
          onLeave: () => pop(0.8, 0.6),
          onLeaveBack: () => {
            pop(0.5, 0.3);
            updateTownIndex(i - 1);
          },
        });
      });
    });

    return () => ctx.revert(); // kills all tweens/triggers on unmount
  });
</script>

<div class="map">
  <svg
    viewBox="0 0 800 1200"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    {@html railMapSvg}
  </svg>
</div>

<style>
  .map {
    height: 100%;
    width: 100%;
    padding: 1rem;
    pointer-events: auto;
    background-color: var(--color-base-200);
  }
  .map svg {
    display: block;
    width: 100%;
    height: 100%;
  }
 
  @media (max-width: 767px) {
    .map {
      padding: 0.25rem;
    }
  }
</style>