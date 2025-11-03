<script>
  import GridRightPanel from '$lib/components/GridRightPanel.svelte';
  import GridLeftPanel from '$lib/components/GridLeftPanel.svelte';
  
  import town01 from '$lib/assets/svg/town-01.svg?raw';
  import town02 from '$lib/assets/svg/town-02.svg?raw';
  import town03 from '$lib/assets/svg/town-03.svg?raw';
  import town04 from '$lib/assets/svg/town-04.svg?raw';
  import town05 from '$lib/assets/svg/town-05.svg?raw';
  import town06 from '$lib/assets/svg/town-06.svg?raw';
  import town07 from '$lib/assets/svg/town-07.svg?raw';
  import town08 from '$lib/assets/svg/town-08.svg?raw';
  import townModel from '$lib/assets/svg/town-model.svg?raw';

  let currentTownIndex = $state(-1); // before any town index

  const towns = [
    { name: "Chebanse", svg: town01, description: `Chebanse, Illinois`},
    { name: "Onarga", svg: town02, description: `Onarga, Illinois` },
    { name: "Champaign", svg: town03, description: `Champaign, Illinois`},
    { name: "Arcola", svg: town04, description: `Arcola, Illinois` },
    { name: "Neoga", svg: town05, description: `Neoga, Illinois` },
    { name: "Farina", svg: town06, description: `Farina, Illinois` },
    { name: "Centralia", svg: town07, description: `Centralia, Illinois` },
    { name: "Tamaroa", svg: town08, description: `Tamaroa, Illinois` }
  ];

  function updateTownIndex(index) {
  currentTownIndex = index;
}
</script>

<svelte:head>
  <title>Template towns</title>
</svelte:head>

<div class="page-container">
  <div class="fixed inset-0 two-panel-grid" style="top: 60px; height: calc(100vh - 60px);">
    

    <div class="h-full w-full relative">

      <div class="absolute inset-0 flex flex-col justify-center bg-base-100 px-6 py-8 z-20">
        <div class="narrative-content text-md leading-relaxed">
          <h1 class="text-4xl font-bold">Template towns</h1>
          <!-- <p>
            The layout of a town says a lot about how it was founded.
          </p> -->
          <p>
            In 1850, the U.S. government gives free land in the form of land grants to railroad companies to settle the West. The Illinois Central Railroad is given the first one.
          </p>
          <p>
            To lay down tracks and establish towns as quickly as possible, the railroad company makes templates to mass-produce the towns. A town is platted every 6-10 miles of track, with the <span class="text-grid font-bold">street grid</span> aligned with the <span class="text-rail font-bold">railroad tracks</span>. 
          </p>
          <p>
            Below is a common template. Streets parallel to the tracks are named for trees, always in this same order. <span class="text-chestnut font-bold">Chestnut Street </span> and <span class="text-oak font-bold">Oak Street</span> always sandwich the tracks. Perpendicular streets are numbered or named after presidents.
          </p>

          <div class="w-full flex justify-center">
            <div class="relative w-full text-center" 
                 style="
                   max-width: 375px; 
                   aspect-ratio: 375 / 300;
                   max-height: 300px;
                 ">
              <div class="masked-svg" 
                   style="
                     width: 100%;
                     height: 100%;
                     overflow: hidden;
                   ">
                {@html townModel}
              </div>
            </div>
          </div>
          <p>
            Today, these street grids still define the small towns and the old downtowns of big cities along the Illinois Central Railroad.
          </p>
          <p class="text-rail">Scroll to visit template towns along the rail line ↓</p>
        </div>
      </div>
      
      <div class="absolute inset-0 z-10">
        <GridLeftPanel {towns} {currentTownIndex} />
      </div>
    </div>
    
    <div class="h-full w-full">
      <GridRightPanel {towns} {updateTownIndex} />
    </div>
    
  </div>
  
  <div id="scroll-container" style="height: {10 * 100}vh; margin-top: 100vh;">
    <!-- the scroll-container height is number of towns x 100% of viewport/screen height + a full screen height for narrative section + a full screen height for end of railroad path - each town gets ~1 full screen height of scroll to animate through -->
    <!-- Extra section for narrative -->
    <div class="scroll-trigger-narrative" style="height: 100vh;"></div>
    
    {#each towns as town, i}
      <div class="town-trigger" data-town-index={i} style="height: 100vh;"></div>
    {/each}
  </div>
</div>