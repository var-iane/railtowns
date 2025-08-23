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

  let currentTownIndex = $state(-1); // before any town index

  const towns = [
    { name: "Chebanse", svg: town01, description: `This is Chebanse, Illinois.<br><br> The <span class="text-grid font-bold">original street grid</span> is aligned with the <span class="text-rail font-bold">railroad tracks</span>. The <span class="text-allpaths font-bold">roads built up later</span> align north and south.<br><br>Streets perpendicular to the tracks are numbered; <br>streets perpendicular to them are named after trees. <br><br>Here, <span class="text-chestnut font-bold">Chestnut</span> is left of the tracks and <span class="text-oak font-bold">Oak</span> is to their right.<br><br>`},
    { name: "Onarga", svg: town02, description: `Onarga, Illinois. <br><br>But this pattern repeats itself. Again, <span class="text-chestnut font-bold">Chestnut</span> left of the tracks and <span class="text-oak font-bold">Oak</span> to the right.` },
    { name: "Champaign-Urbana", svg: town03, description: `Champaign, Illinois is a big college town.<br><br>Yet the old downtown looks awfully familiar: a few diagonal streets, stamped in the center of a north-south grid. <br><br>There are still vestiges of <span class="text-chestnut font-bold">Chestnut St.</span> and <span class="text-oak font-bold">Oak St.</span>`},
    { name: "Arcola", svg: town04, description: `Arcola, Illinois.` },
    { name: "Neoga", svg: town05, description: `Neoga, Illinois.` },
    { name: "Farina", svg: town06, description: `Farina, Illinois.` },
    { name: "Centralia", svg: town07, description: `Centralia, Illinois.` },
    { name: "Tamaroa", svg: town08, description: `Tamaroa, Illinois, just one of countless template towns.` }
  ];

  function updateTownIndex(index) {
  currentTownIndex = index;
}
</script>

<svelte:head>
  <title>Template towns</title>
</svelte:head>

<div class="page-container">
  <!-- Fixed two-panel grid layout -->
  <div class="fixed inset-0 two-panel-grid" style="top: 60px; height: calc(100vh - 60px);">
    
    <!-- Left panel: Narrative → Interactive towns -->
    <div class="h-full w-full relative">
      <!-- Static narrative content -->
      <div class="absolute inset-0 flex flex-col justify-center bg-base-100 px-6 py-8 z-20">
        <div class="narrative-content">
          <h1 class="text-5xl font-bold mb-6">Template towns</h1>
          <p class="text-xl leading-relaxed">
            In 1850, the U.S. government gives free land in the form of land grants to railroad companies to settle the West. 
            The Illinois Central Railroad—the "Main Line of Mid-America"—is given the first one.
          </p>
          <p class="text-xl leading-relaxed">
            The railroad company needs to lay down tracks and establish towns as quickly as possible. It's a race against other railroad companies and settlers to claim the land first.
          </p>
          <p class="text-xl leading-relaxed">
            So what does it do? It makes a town template to mass-produce the towns. Steam trains need frequent water stops, so a town is plopped down every 6-10 miles of track.
          </p>
          <p class="text-xl leading-relaxed">
            These new railroad towns have a lot in common.
          </p>
          <p class="text-lg mt-4 opacity-70">Scroll to travel along the rail line ↓</p>
        </div>
      </div>
      
      <!-- Interactive towns panel (hidden initially, shown on scroll) -->
      <div class="absolute inset-0 z-10">
        <GridLeftPanel {towns} {currentTownIndex} />
      </div>
    </div>
    
    <!-- Right panel: Always visible Illinois map -->
    <div class="h-full w-full">
      <GridRightPanel {towns} {updateTownIndex} />
    </div>
    
  </div>
  
  <!-- Scroll triggers -->
  <div id="scroll-container" style="height: {10 * 100}vh; margin-top: 100vh;">
    <!-- the scroll-container height is number of towns x 100% of viewport/screen height + a full screen height for narrative section + a full screen height for end of railroad path - each town gets ~1 full screen height of scroll to animate through -->
    <!-- Extra section for narrative -->
    <div class="scroll-trigger-narrative" style="height: 100vh;"></div>
    
    <!-- Town triggers -->
    {#each towns as town, i}
      <div class="town-trigger" data-town-index={i} style="height: 100vh;"></div>
    {/each}
  </div>
</div>