<script>
  import RailMapFormerCurrent from '$lib/components/RailMapFormerCurrent.svelte';
  
  let mapProgress = 0;
  
  function handleProgressChange(progress) {
    mapProgress = progress;
    // You can use this to trigger other animations or updates
    console.log('Map transition progress:', progress);
  }

  import PopMap from '$lib/components/PopMap.svelte';
  import PopChart from '$lib/components/PopChart.svelte';
  // import PopChartHorz from '$lib/components/PopChartHorz.svelte'
  import PopAnnotations from '$lib/components/PopAnnotations.svelte';
  import townPopulations from '$lib/data/town_populations.json';
  
  let townData = townPopulations;
  let highlightedPeriod = null;

  // Debug: Check if data is loading
  console.log('Town data loaded:', townData);
  
  function handleAnnotationHighlight(event) {
    console.log('Annotation clicked:', event.detail);
    highlightedPeriod = event.detail;
  }

  function handleChartClick(event) {
    console.log('Chart clicked:', event.detail);
    const { data } = event.detail;
  }

  // Debug: Check reactive updates
  $: console.log('Highlighted period changed:', highlightedPeriod);
</script>

<svelte:head>
  <title>Rail Towns</title>
</svelte:head>

<div class="page-container">
  
  <!-- Opening narrative -->
  <header class="narrative-section">
    <div class="narrative-content">
      <h1 class="text-5xl font-bold mb-6">The slow leak of railroad towns</h1>
      <p class="text-xl leading-relaxed mb-4">
        To the west, rail tracks snaked across the Great Plains, spitting out a settler town every [] miles. The railroads fueled these largely agricultural towns—and the towns the railroads—like blood vessels; when the blood supply was cut off. A number of factors might have choked off the blood supply: small family farms got largely replaced by corporate farms, overfarming and unsustainable farming practices killed the land and led to the Dust Bowl, the car replaced the train as the dominant American mode of transportation, railroads went bankrupt, the farming crisis of 1980.
      </p>
    </div>
  </header>

  <!-- Before/After map section -->
  <section class="w-full min-h-screen bg-base-200">
    <div class="container mx-auto px-6 py-16">
      
      <!-- Map introduction -->
      <div class="narrative-content mb-12">
        <p class="text-lg">
          The viability of the railroad went hand-in-hand with that of the towns. What happened to these towns when the railroads left?
        </p>
      </div>
      
      <!-- Interactive map container -->
      <div class="w-full flex justify-center bg-base-200">
          <RailMapFormerCurrent onProgressChange={handleProgressChange} />
      </div>
      
    </div>
  </section>

  <!-- Population chart section -->
  <section class="w-full min-h-screen bg-base-100">
    <div class="container mx-auto px-6 py-16">

      <!-- Chart introduction -->
      <div class="narrative-content mb-8">
        <h2 class="text-3xl font-bold mb-4">Population over time</h2>
        <p class="text-lg">
          External forces—drought, economic collapse, rail closures—
          shaped the fate of these communities.
        </p>
      </div>

      <!-- <div class="border-2 border-green-500 p-4 bg-base-200">
        <h3 class="text-lg font-bold mb-4">Chart Panel</h3>
        <PopChart 
          data={townData} 
          {highlightedPeriod} 
          on:heatmapClick={handleChartClick} 
        />
      </div> -->

       <!-- Debug info -->
    <div class="mb-4 p-4 bg-yellow-100 rounded">
      <p><strong>Debug Info:</strong></p>
      <p>Town data length: {townData?.length || 'No data'}</p>
      <p>Highlighted period: {JSON.stringify(highlightedPeriod) || 'None'}</p>
    </div>

      <!-- Two-panel chart layout with debug borders -->
    <div class="grid grid-cols-[300px_1fr] gap-8 h-[600px] border-2 border-red-500">
      
      <!-- Left panel -->
      <div class="border-2 border-blue-500 p-4 overflow-y-auto bg-base-200">
        <h3 class="text-lg font-bold mb-4">Annotations Panel</h3>
        <PopAnnotations on:highlight={handleAnnotationHighlight} />
      </div>
      
      <!-- Right panel -->
      <div class="border-2 border-green-500 p-4 bg-base-200">
        <h3 class="text-lg font-bold mb-4">Chart Panel</h3>
        <PopChart 
          data={townData} 
          {highlightedPeriod} 
          on:heatmapClick={handleChartClick} 
        />
      </div>
      
    </div>
    </div>
  </section>

</div>

<style>
  /* .map-container {
    width: min(90vw, 1000px);
    height: 600px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    overflow: hidden;
  } */

</style>