<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  import railMapSvg from '$lib/assets/svg/illinois-rail-map.svg?raw';

  gsap.registerPlugin(ScrollTrigger);

  export let towns = [];
  export let updateTownIndex;

onMount(() => {
  setTimeout(() => {
    // Find the railroad path element
    let railroadPath = document.getElementById('railroad-path');
    
    if (!railroadPath) {
      const railroadGroup = document.getElementById('railroad');
      railroadPath = railroadGroup ? railroadGroup.querySelector('path') : null;
    }
    
    if (railroadPath && typeof railroadPath.getTotalLength === 'function') {
      const pathLength = railroadPath.getTotalLength();
      
      // Set up the railroad path animation
      gsap.set(railroadPath, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });

      // Main scroll trigger for railroad animation and panel transitions
      ScrollTrigger.create({
        trigger: '#scroll-container',
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Fade out narrative panel when scrolling starts
          const narrativeOpacity = Math.max(0, 1 - (progress * (towns.length + 1) * 1.5));
          const narrativePanel = document.querySelector('.absolute.z-20');
          if (narrativePanel) {
            gsap.set(narrativePanel, { opacity: narrativeOpacity });
          }
          
          // Calculate town index - account for initial narrative section
          let townIndex = -1;
          const narrativeSection = 1 / (towns.length + 1); // First section is narrative
          
          if (progress > narrativeSection) {
            // Adjust progress to exclude narrative section
            const adjustedProgress = (progress - narrativeSection) / (1 - narrativeSection);
            const currentSegment = Math.floor(adjustedProgress * towns.length);
            townIndex = Math.min(currentSegment, towns.length - 1);
          }
          
          updateTownIndex(townIndex);
          
          // Update railroad stroke - starts after narrative section
          const railroadProgress = Math.max(0, progress - narrativeSection);
          const adjustedRailroadProgress = railroadProgress / (1 - narrativeSection);
          gsap.set(railroadPath, {
            strokeDashoffset: pathLength * (1 - adjustedRailroadProgress)
          });
        }
      });

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
          gsap.set(marker, { scale: 0.5, opacity: 0.3 });
          
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

  // onMount(() => {
  //   setTimeout(() => {
  //     let railroadPath = document.getElementById('railroad-path');
      
  //     if (!railroadPath) {
  //       const railroadGroup = document.getElementById('railroad');
  //       railroadPath = railroadGroup ? railroadGroup.querySelector('path') : null;
  //     }
      
  //     if (railroadPath && typeof railroadPath.getTotalLength === 'function') {
  //       const pathLength = railroadPath.getTotalLength();
        
  //       // Set up the railroad path animation
  //       gsap.set(railroadPath, {
  //         strokeDasharray: pathLength,
  //         strokeDashoffset: pathLength
  //       });

  //       // Create scroll trigger for railroad animation and town switching
  //       ScrollTrigger.create({
  //         trigger: '#scroll-container',
  //         start: 'top top',
  //         end: 'bottom bottom',
  //         onUpdate: (self) => {
  //           const progress = self.progress;
            
  //           // Calculate town index - but only show towns after some initial progress
  //           let townIndex = -1; // Start with no town visible
            
  //           if (progress > 0) {
  //             // Each town appears when we're a certain percentage through
  //             // Divide the progress into equal segments for each town
  //             const segmentSize = 1 / towns.length;
  //             const currentSegment = Math.floor(progress / segmentSize);
  //             townIndex = Math.min(currentSegment, towns.length - 1);
  //           }
            
  //           updateTownIndex(townIndex);
            
  //           // Update railroad stroke
  //           gsap.set(railroadPath, {
  //             strokeDashoffset: pathLength * (1 - progress)
  //           });
  //         }
  //       });

  //       // Animate town markers
  //       towns.forEach((town, i) => {
  //         const possibleIds = [
  //           `town0${(i + 1).toString().padStart(2, '0')}-${town.name.toLowerCase().replace(/[\s-]/g, '')}`,
  //           `town0${i + 1}-${town.name.toLowerCase().replace(/[\s-]/g, '')}`,
  //           `town0${i + 1}-${town.name.toLowerCase()}`,
  //           `town${i + 1}-${town.name.toLowerCase()}`
  //         ];
          
  //         let marker = null;
  //         for (const id of possibleIds) {
  //           marker = document.getElementById(id);
  //           if (marker) break;
  //         }
          
  //         if (marker) {
  //           gsap.set(marker, { scale: 0.5, opacity: 0.3 });
            
  //           ScrollTrigger.create({
  //             trigger: '#scroll-container',
  //             start: `${(i / towns.length) * 100}% top`,
  //             end: `${((i + 1) / towns.length) * 100}% top`,
  //             onEnter: () => gsap.to(marker, { scale: 1.2, opacity: 1, duration: 0.3 }),
  //             onLeave: () => gsap.to(marker, { scale: 0.8, opacity: 0.6, duration: 0.3 }),
  //             onEnterBack: () => gsap.to(marker, { scale: 1.2, opacity: 1, duration: 0.3 }),
  //             onLeaveBack: () => gsap.to(marker, { scale: 0.5, opacity: 0.3, duration: 0.3 })
  //           });
  //         }
  //       });
  //     }
  //   }, 200);
  // });
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