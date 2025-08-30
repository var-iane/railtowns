<div class="page-container">
  <!-- Mobile: Vertical stack -->
  <div class="mobile-layout md:hidden">
    <div class="fixed inset-0" style="top: 60px; height: calc(100vh - 60px);">
      
      <!-- Map panel on top (compact) -->
      <div class="h-[35vh] w-full border-b border-base-300">
        <GridRightPanel {towns} {updateTownIndex} />
      </div>
      
      <!-- Town content below (larger) -->
      <div class="h-[65vh] w-full">
        <GridLeftPanel {towns} {currentTownIndex} />
      </div>
      
    </div>
  </div>

  <!-- Desktop: Keep your existing two-panel grid -->
  <div class="desktop-layout hidden md:block">
    <div class="fixed inset-0 two-panel-grid" style="top: 60px; height: calc(100vh - 60px);">
      <!-- Your existing left panel -->
      <div class="h-full w-full relative">
        <div class="absolute inset-0 flex flex-col justify-center bg-base-100 px-6 py-8 z-20">
          <!-- Narrative content -->
        </div>
        <div class="absolute inset-0 z-10">
          <GridLeftPanel {towns} {currentTownIndex} />
        </div>
      </div>
      
      <!-- Your existing right panel -->
      <div class="h-full w-full">
        <GridRightPanel {towns} {updateTownIndex} />
      </div>
    </div>
  </div>
  
  <!-- Scroll triggers (same for both layouts) -->
  <div id="scroll-container" style="height: {10 * 100}vh; margin-top: 100vh;">
    <!-- Your existing scroll triggers -->
  </div>
</div>

<!-- In GridRightPanel.svelte -->
<div class="h-full w-full flex justify-center items-center bg-base-200 p-2 md:p-4">
  <div class="w-full h-full flex justify-center items-center">
    <svg
      viewBox="0 0 800 1200"
      class="max-w-full max-h-full"
      style="width: auto; height: 85%;"  
    >
      {@html railMapSvg}
    </svg>
  </div>
</div>

<!-- In GridLeftPanel.svelte -->
<div class="h-full w-full flex flex-col bg-base-100 px-2 md:px-4 py-3 md:py-6 gap-2 md:gap-3">
  
  <!-- SVG container - smaller on mobile -->
  <div class="relative flex-shrink-0" style="width: 100%; max-width: 500px; height: 300px; md:width: 600px; md:height: 480px;">
    <!-- Your town SVGs -->
  </div>

  <!-- Description - smaller text on mobile -->
  {#if currentTownIndex >= 0 && towns[currentTownIndex]?.description}
    <div class="flex-shrink-0 w-full max-w-[500px] md:w-[600px] text-xs md:text-sm text-center text-base-content p-2 md:p-4 bg-base-200 rounded shadow min-h-[50px] md:min-h-[60px]">
      <!-- Your description content -->
    </div>
  {/if}

</div>