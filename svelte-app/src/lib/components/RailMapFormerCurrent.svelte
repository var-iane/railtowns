<script>
  import { onMount } from 'svelte';
  
  let scrollY = 0;
  let innerHeight = 0;
  let mapSection;
  let progress = 0;
  
  // Calculate transition progress based on scroll position
  $: if (mapSection && typeof window !== 'undefined') {
    const rect = mapSection.getBoundingClientRect();
    const sectionTop = scrollY + rect.top;
    const sectionHeight = rect.height;
    
    // Start transition when map reaches center of viewport
    const triggerStart = sectionTop - (innerHeight * 0.5);
    const triggerEnd = sectionTop + sectionHeight - (innerHeight * 0.5);
    const triggerDistance = triggerEnd - triggerStart;
    
    if (scrollY < triggerStart) {
      progress = 0;
    } else if (scrollY > triggerEnd) {
      progress = 1;
    } else {
      progress = (scrollY - triggerStart) / triggerDistance;
    }
  }
  
  // Optional: expose progress to parent component
  export let onProgressChange = null;
  $: if (onProgressChange) onProgressChange(progress);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<section bind:this={mapSection} class="rail-maps-section">
  <div class="maps-container">
    <!-- Historical rails map -->
    <div 
      class="map historical-map" 
      style="opacity: {1 - progress}; transform: translateY({progress * -10}px) scale({1 - progress * 0.02})"
    >
      <img src="/images/us-rail-all.png" alt="Historical US Railroad Network" />
    </div>
    
    <!-- Current rails map -->
    <div 
      class="map current-map" 
      style="opacity: {progress}; transform: translateY({(1 - progress) * 10}px) scale({0.98 + progress * 0.02})"
    >
      <img src="/images/us-rail-current.png" alt="Current US Railroad Network" />
    </div>
  </div>
</section>

<style>
  .rail-maps-section {
    height: 250vh; /* Allows for scroll progression */
    position: relative;
  }

  .maps-container {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .map {
    position: absolute;
    width: 90%;
    max-width: 1200px;
    height: auto;
    transition: opacity 0.05s ease-out, transform 0.05s ease-out;
  }
  
  .map img, .map svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
  }
</style>