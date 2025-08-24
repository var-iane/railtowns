<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
  import railMapSvg from '$lib/assets/svg/illinois-rail-map.svg?raw';

  gsap.registerPlugin(ScrollTrigger,DrawSVGPlugin);

  let { towns = [], updateTownIndex } = $props();

onMount(() => {
  setTimeout(() => {
    let railroadPath = document.getElementById('railroad-path');

    if (railroadPath) {
      // below is function to find closest point on path to a town marker
      // function getTownPositionOnPath(townId) {
      //   const townMarker = document.getElementById(townId);
      //   if (!townMarker) return null;
        
      //   // Get town's center coordinates
      //   const svg = railroadPath.ownerSVGElement;
      //   const townBBox = townMarker.getBBox();
      //   const townX = townBBox.x + townBBox.width / 2;
      //   const townY = townBBox.y + townBBox.height / 2;
        
      //   // Find closest point on railroad path
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
      
      // // Calculate positions for all towns
      // const townPositions = [
      //   getTownPositionOnPath('town01-chebanse'),
      //   getTownPositionOnPath('town02-onarga'),
      //   getTownPositionOnPath('town03-champaign-urbana'),
      //   getTownPositionOnPath('town04-arcola'),
      //   getTownPositionOnPath('town05-neoga'),
      //   getTownPositionOnPath('town06-farina'),
      //   getTownPositionOnPath('town07-centralia'),
      //   getTownPositionOnPath('town08-tamaroa')
      // ];
      
      // console.log('Town positions along path:', townPositions);

      // once I got the town positions, hard-coded it here
      const townPositions = [0.14, 0.2, 0.33, 0.42, 0.49, 0.61, 0.69, 0.77]

      // 10 total sections, 1 narrative + 8 towns + 1 final
      const totalSections = 10;
      const narrativeSection = 1 / totalSections;     // 0.1
      const townsSections = 8 / totalSections;        // 0.8
      const finalSection = 1 / totalSections;         // 0.1
      const firstTownPos = townPositions[0];          // 0.14
      const lastTownPos = townPositions[townPositions.length - 1]; // 0.77
    
      gsap.set(railroadPath, { drawSVG: "0%" });

      // railroad scrolltrigger
      ScrollTrigger.create({
        trigger: '#scroll-container', // this div id is in page.svelte parent
        start: 'top bottom', // start when top of container hits bottom of viewport
        end: 'bottom bottom', // end when bottom of container hits bottom of viewport
        onUpdate: (self) => {  // as user scrolls through giant container,
          const progress = self.progress; // call 'progress' number from 0 to 1 that represents how far they are

          // start narrative at full opacity, fade out quickly within first 10% scrolling progress
          const narrativeOpacity = Math.max(0, 1 - (progress * totalSections * 1.5));
          // narrative panel is only element with both classes 'absolute' and 'z-20'
          const narrativePanel = document.querySelector('.absolute.z-20');
          if (narrativePanel) {
            gsap.set(narrativePanel, { opacity: narrativeOpacity });
          }
          
          // calculate town index
          let townIndex = -1; // no town is visible initially
          if (progress > narrativeSection && progress <= (narrativeSection + townsSections)) {
            const townsProgress = (progress - narrativeSection) / townsSections;
            const currentSegment = Math.floor(townsProgress * towns.length);
            townIndex = Math.min(currentSegment, towns.length - 1);
          }

          // draw railroad through all 10 sections
          if (progress > 0) {
            let railroadDrawTo;
            
            if (progress <= narrativeSection) {
              // Section 1: Draw from 0 to first town position
              const sectionProgress = progress / narrativeSection;
              railroadDrawTo = townPositions[0] * sectionProgress; // 0 to 0.14
              
            } else if (progress <= (narrativeSection + townsSections)) {
              // Sections 2-9: Draw through towns
              const townsProgress = (progress - narrativeSection) / townsSections;
              const railroadStart = townPositions[0]; // 0.14
              const railroadEnd = townPositions[townPositions.length - 1]; // 0.77
              railroadDrawTo = railroadStart + (railroadEnd - railroadStart) * townsProgress;
              
            } else {
              // Section 10: Draw from last town to end
              const finalProgress = (progress - narrativeSection - townsSections) / finalSection;
              railroadDrawTo = lastTownPos + (1.0 - lastTownPos) * finalProgress; // 0.77 to 1.0
            }
            
            gsap.set(railroadPath, {
              drawSVG: `0% ${railroadDrawTo * 100}%`
            });
            
            // Fade out town panel in section 10
            const leftPanel = document.querySelector('.absolute.z-10'); // Your towns panel
            if (leftPanel) {
              const finalSectionStart = narrativeSection + townsSections;
              if (progress > finalSectionStart) {
                const fadeProgress = (progress - finalSectionStart) / finalSection;
                gsap.set(leftPanel, { opacity: Math.max(0, 1 - fadeProgress * 2) });
              } else {
                gsap.set(leftPanel, { opacity: 1 });
              }
            }
            
          } else {
            gsap.set(railroadPath, { drawSVG: "0%" });
          }
        }
      });

      towns.forEach((town, i) => {
        const markerId = `town0${i + 1}-${town.name.toLowerCase()}`;
        let marker = document.getElementById(markerId);

        if (marker) {
          gsap.set(marker, { scale: 0.5, opacity: 0 });
          
          // when each town should appear
          const townPathPosition = townPositions[i];
          const townProgressInSection = (townPathPosition - firstTownPos) / (lastTownPos - firstTownPos);
          const townScrollPosition = narrativeSection + (townProgressInSection * townsSections);

          console.log(`Town ${i} (${town.name}):`, {
            pathPosition: townPathPosition,
            progressInSection: townProgressInSection,
            scrollPosition: townScrollPosition,
            scrollPercent: `${townScrollPosition * 100}%`
          });
          
          // town scrolltrigger
          ScrollTrigger.create({
            trigger: '#scroll-container',
            start: `${townScrollPosition * 100}% bottom`,
            end: `${(townScrollPosition + 0.05) * 100}% bottom`, // Small window
            onEnter: () => {
              console.log(`Town ${i} entering!`);
              gsap.to(marker, { scale: 1.2, opacity: 1, duration: 0.3 });
              updateTownIndex(i); // show this town's svg
            },
            onLeave: () => {
              gsap.to(marker, { scale: 0.8, opacity: 0.6, duration: 0.3 });
              // Keep current town showing when leaving forward
            },
            onEnterBack: () => {
              gsap.to(marker, { scale: 1.2, opacity: 1, duration: 0.3 });
              updateTownIndex(i);  // ← Show this town's SVG again
            },
            onLeaveBack: () => {
              gsap.to(marker, { scale: 0.5, opacity: 0.3, duration: 0.3 });
              updateTownIndex(i - 1);  // ← Show previous town (or -1 if first town)
            }
          });
        }
      });
    }
  }, 200);
});

</script>

<div class="h-full w-full flex justify-center items-center bg-base-200 p-4" style="pointer-events: auto;">
  <div class="w-full h-full flex justify-center items-center">
    <svg
      viewBox="0 0 800 1200"
      class="max-w-full max-h-full"
      style="width: auto; height: 90%;"
      xmlns="http://www.w3.org/2000/svg"
    >
      {@html railMapSvg}
    </svg>
  </div>
</div>