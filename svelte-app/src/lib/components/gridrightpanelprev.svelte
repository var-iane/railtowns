<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
  import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
  import railMapSvg from '$lib/assets/svg/illinois-rail-map.svg?raw';

  gsap.registerPlugin(ScrollTrigger,DrawSVGPlugin,MotionPathPlugin);

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
      
      // Calculate positions for all towns
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
    
      gsap.set(railroadPath, { drawSVG: "0%" });

      ScrollTrigger.create({
        trigger: '#scroll-container', // this div id is in page.svelte parent
        start: 'top bottom', // start when top of container hits bottom of viewport
        end: 'bottom bottom', // end when bottom of container hits bottom of viewport
        onUpdate: (self) => {  // as user scrolls through giant container,
          const progress = self.progress; // call 'progress' number from 0 to 1 that represents how far they are
          
          // start narrative at full opacity, fade out quickly within first 10% scrolling progress
          // 8 towns + 1 narrative = 9 sections, 11.1% of scroll distance per section
          const narrativeOpacity = Math.max(0, 1 - (progress * (towns.length + 1) * 1.5));
          // narrative panel is only element with both classes 'absolute' and 'z-20'
          const narrativePanel = document.querySelector('.absolute.z-20');
          if (narrativePanel) {
            gsap.set(narrativePanel, { opacity: narrativeOpacity });
          }
          
          let townIndex = -1; // no town is visible initially
          const narrativeSection = 1 / (towns.length + 1); // first section is narrative
          
          if (progress > narrativeSection) {
            // adjust progress to exclude narrative section, calculate which town to show
            const adjustedProgress = (progress - narrativeSection) / (1 - narrativeSection);
            const currentSegment = Math.floor(adjustedProgress * towns.length); // Math.floor rounds number down to nearest integer
            townIndex = Math.min(currentSegment, towns.length - 1);
          }
          
          updateTownIndex(townIndex);

          // smooth railroad animation with interpolation
          if (progress > narrativeSection) {
            const adjustedProgress = (progress - narrativeSection) / (1 - narrativeSection);
            
            const totalSegments = towns.length + 1; // +1 for final drawing segment
            const currentSegmentFloat = adjustedProgress * totalSegments;
            const currentSegmentIndex = Math.floor(currentSegmentFloat);
            const segmentProgress = currentSegmentFloat - currentSegmentIndex;
            
            let railroadDrawTo;
            
            if (currentSegmentIndex >= towns.length) {
              // Final segment: draw from last town (0.77) to end (1.0)
              const lastTownPos = townPositions[townPositions.length - 1]; // 0.77
              railroadDrawTo = lastTownPos + (1.0 - lastTownPos) * segmentProgress;
            } else if (currentSegmentIndex === towns.length - 1) {
              // Special case: transitioning from last town to final segment
              const lastTownPos = townPositions[townPositions.length - 1]; // 0.77
              railroadDrawTo = lastTownPos + (1.0 - lastTownPos) * segmentProgress;
            } else {
              // Interpolate between current and next town
              const currentTownPos = townPositions[currentSegmentIndex] || 0;
              const nextTownPos = townPositions[currentSegmentIndex + 1];
              railroadDrawTo = currentTownPos + (nextTownPos - currentTownPos) * segmentProgress;
            }
            
            gsap.set(railroadPath, {
              drawSVG: `0% ${railroadDrawTo * 100}%`
            });
          } else {
            // Hide during narrative
            gsap.set(railroadPath, { drawSVG: "0%" });
          }
        }
      });
          
          // Update railroad stroke - starts after narrative section
      //     const railroadProgress = Math.max(0, progress - narrativeSection);
      //     const adjustedRailroadProgress = railroadProgress / (1 - narrativeSection);
      //     gsap.set(railroadPath, {
      //       drawSVG: `0% ${townPositions[currentTownIndex] * 100}%`
      //     });
      //   }
      // });

      // Animate town markers appearing
      towns.forEach((town, i) => {
        const possibleIds = [
          `town0${(i + 1).toString().padStart(2, '0')}-${town.name.toLowerCase().replace(/[\s-]/g, '')}`,
          `town0${i + 1}-${town.name.toLowerCase().replace(/[\s-]/g, '')}`,
          `town0${i + 1}-${town.name.toLowerCase()}`,
          `town${i + 1}-${town.name.toLowerCase()}`
        ];
        
        let marker = null;
        for (const id of possibleIds) {
          marker = document.getElementById(id);
          if (marker) break;
        }
        
        if (marker) {
          gsap.set(marker, { scale: 0.5, opacity: 0 });
          
          // Calculate when this town should appear (after narrative section)
          const narrativeSection = 1 / (towns.length + 1);
          const townStart = narrativeSection + (i / towns.length) * (1 - narrativeSection);
          const townEnd = narrativeSection + ((i + 1) / towns.length) * (1 - narrativeSection);
          
          ScrollTrigger.create({
            trigger: '#scroll-container',
            start: `${townStart * 100}% top`,
            end: `${townEnd * 100}% top`,
            onEnter: () => gsap.to(marker, { scale: 1.2, opacity: 1, duration: 0.3 }),
            onLeave: () => gsap.to(marker, { scale: 0.8, opacity: 0.6, duration: 0.3 }),
            onEnterBack: () => gsap.to(marker, { scale: 1.2, opacity: 1, duration: 0.3 }),
            onLeaveBack: () => gsap.to(marker, { scale: 0.5, opacity: 0.3, duration: 0.3 })
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