<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let { towns = [], currentTownIndex } = $props();

  let townElements = $state([]);
  let descriptionElement = $state(null);
  let previousIndex = $state(-1);

  onMount(() => {
    // all towns invisible initially
    townElements.forEach((el, i) => {
      if (el) {
        gsap.set(el, { opacity: 0 });
      }
    });
  });

  // Reactive statement to handle town changes
  $effect(() => {
  if (currentTownIndex !== previousIndex && townElements.length > 0) {
    // Kill all existing animations on town elements first
    gsap.killTweensOf(townElements);
    if (descriptionElement) gsap.killTweensOf(descriptionElement); 

    // Fade out previous town (if there was one)
    if (previousIndex >= 0 && townElements[previousIndex]) {
      gsap.to(townElements[previousIndex], {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out" // starts fast, then slows down toward end
      });
    }

    // fade out description first
    if (descriptionElement) {
      gsap.to(descriptionElement, {
        opacity: 0,
        duration: 0.1
      });
    }
    
    // Fade in current town
    if (currentTownIndex >= 0 && townElements[currentTownIndex]) {
      gsap.to(townElements[currentTownIndex], {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
        delay: 0.3
      });
    }

    // fade in description box (if it exists)
    if (descriptionElement && towns[currentTownIndex]?.description) {
        gsap.to(descriptionElement, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
          delay: 0.5
      });
    }

    previousIndex = currentTownIndex;
  }
});
</script>


<!-- Grid child - fills the flexible (1fr) column -->
<div class="h-full w-full flex flex-col bg-base-100 px-4 py-6 gap-3" 
     style="pointer-events: auto; align-items: center; justify-content: center;">

  <!-- Fixed-size SVG container -->
  <div class="relative flex-shrink-0" style="width: 600px; height: 480px;">
    {#each towns as town, i}
      <div 
        bind:this={townElements[i]}
        class="town{(i + 1).toString().padStart(2, '0')}"
        style="
          position: absolute;
          top: 0px;
          left: 0px;
          width: 600px;
          height: 480px;
          box-sizing: border-box;
        "
      >
        <div style="
          width: 100%;
          height: 100%;
          overflow: hidden;
        ">
          {@html town.svg}
        </div>
      </div>
    {/each}
  </div>

  <div 
    bind:this={descriptionElement}
    class="flex-shrink-0 w-[600px] text-sm text-center text-base-content p-4 bg-base-200 rounded shadow min-h-[60px]" 
    style="display: flex; align-items: center; justify-content: center; opacity: 0;"
  >
    {#if currentTownIndex >= 0 && towns[currentTownIndex]?.description}
      <p>
        {@html towns[currentTownIndex].description}
      </p>
    {/if}
  </div>

</div>

