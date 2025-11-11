<script>

  import { base } from '$app/paths';

  let showCurrent = $state(false);
  let sliderValue = $state(0);

  const stages = [
    { img: 'plains-boom.png', 
      label: 'Boom times', 
      legend: [
        { color: '#ffa000', text: 'Active lines' }
      ] },
    { img: 'plains-abandoned.png', 
      label: 'Hard times and abandoned lines',
      legend: [
          { color: '#ffa000', text: 'Active lines' },
          { color: '#444872', text: 'Abandoned lines' }
      ] },
    { img: 'plains-places.png', 
      label: 'Towns on the ghost lines',
      legend: [
          { color: '#ffa000', text: 'Active lines' },
          { color: '#009999', text: 'Towns along abandoned routes' }
        ] }
  ];

  function getOpacity(stageIndex) {
    const position = sliderValue / 50;
    
    if (stageIndex === 0) {
      return Math.max(0, 1 - position);
    } else if (stageIndex === 1) {
      if (position < 1) {
        return position;
      } else {
        return Math.max(0, 2 - position);
      }
    } else if (stageIndex === 2) {
      return Math.max(0, position - 1);
    }
    return 0;
  }
  
  let currentStageIndex = $derived(
    sliderValue < 25 ? 0 : sliderValue < 75 ? 1 : 2
  );
  
  let currentStage = $derived(stages[currentStageIndex]);
</script>

<svelte:head>
  <title>Artery towns</title>
</svelte:head>

<div class="page-container">
  <div class="narrative-section">
    <div class="narrative-content text-md leading-relaxed">
      <h1 class="text-4xl font-bold">Artery towns</h1>
      <p>
        Railtowns served, and were served by, railroads. What happened to these towns when their rail routes disappeared?
      </p>
      <p>
        The rise of the interstate highway system and commercial aviation in the 1950s and 60s dealt a massive blow to rail transit. Route-miles of passenger service dropped from about 107,000 miles in 1958; to 49,000 miles in 1970; to 21,000 miles today.
      </p>
      <p>Today, the vast majority of track carries only freight.</p>
        
    <!-- US RAIL MAP -->
    <div class="map-section my-12 font-inconsolata">
      <h2 class="text-2xl font-bold mb-4">The retreat of American passenger rail</h2>

      <!-- toggle -->
      <div class="flex items-center justify-start gap-4 mb-6">
        <span class="text-lg font-medium" class:opacity-30={showCurrent}>Rails a century ago</span>
        <input 
          type="checkbox" 
          class="toggle bg-secondary text-base-content checked:bg-secondary checked:text-base-content border-2 border-base-300"
          bind:checked={showCurrent}
        />
        <span class="text-lg font-medium" class:opacity-30={!showCurrent}>Rails now</span>
      </div>

      <!-- legend -->
      <div class="flex justify-start">
        {#if !showCurrent}
          <div class="legend-item">
            <div class="legend-box" style="background-color: #ffa000;"></div>
            <span class="text-sm">Passenger + freight</span>
          </div>
        {:else}
          <div class="flex gap-6 flex-wrap justify-start">
            <div class="legend-item">
              <div class="legend-box" style="background-color: #ffa000;"></div>
              <span class="text-sm">Passenger + freight</span>
            </div>
            <div class="legend-item">
              <div class="legend-box" style="background-color: #009999;"></div>
              <span class="text-sm">Freight only</span>
            </div>
            <div class="legend-item">
              <div class="legend-box" style="background-color: #444872;"></div>
              <span class="text-sm">Abandoned track</span>
            </div>
          </div>
        {/if}
      </div>

        <div class="map-container mx-auto"
            style="
              max-width: 1200px; 
              aspect-ratio: 800 / 600;
              max-height: 800px;
              position: relative;
            ">
      
          <img 
            src="{base}/images/rails-before.png" 
            alt="Rails then"
            class="map-image"
            style="opacity: {showCurrent ? 0 : 1};"
          />

          <img 
            src="{base}/images/rails-now-types.png" 
            alt="Rails now"
            class="map-image"
            style="opacity: {showCurrent ? 1 : 0};"
          />
        </div>
        </div>

    <!-- PLAINS MAP -->
      

        <div class="map-section my-12 font-inconsolata">
          <h2 class="text-2xl font-bold mb-4">Passenger rail loses its biggest customer</h2>
          <div class="flex flex-col items-start gap-4 mb-6">
          <p>
            Rural railtowns managed to hang on to passenger rail until 1967, thanks to the U.S. Post Office.
          </p>
          <p>Most passenger routes weren't actually profitable for railroad companies, but since the mid-1800s, the Post Office had kept them alive by contracting the rails to carry, sort, and deliver mail aboard special "Railway Post Office" cars hitched to fast passenger trains. Postal clerks worked on the move, sorting letters by hand and hurling and snatching mailbags as the trains whizzed by tiny town stations at 70 miles per hour.</p>
          <p>By 1967, the Post Office couldn't resist the allure of modernization: planes, trucks, and regional (stationary) sorting centers. Without their biggest customer, most passenger routes died. Amtrak took over the scraps of passenger rail in 1970.
          </p>

          <div class="map-section my-12 font-inconsolata">
          <h2 class="text-2xl font-bold mb-4">Abandoned lines in the Great Plains</h2>
            <div class="flex flex-col items-start gap-4 mb-6">
              <p>Many passenger lines turned into freight routes, making profits off cargo instead.</p>
              <p>Other routes hemorrhaged money. Between the late 1960s and 1990s, struggling rail companies began <span class="font-bold" style="color: #444872">abandoning these lines</span> altogether.</p>
              <p><span class="font-bold" style="color: #444872">Abandoned routes</span>, and <span class="font-bold" style="color: #009999">their towns</span>, flank the plains of North Dakota, South Dakota, and Nebraska.</p>
          
            <p class="text-center text-lg font-large transition-opacity">{currentStage.label}</p>
            <input 
              type="range" 
              min="0" 
              max="100" 
              bind:value={sliderValue}
              class="custom-range range range-secondary w-full max-w-md"

            />
            <div class="w-full max-w-md flex justify-between text-sm">
              <span>1920s</span>
              <span>1980s</span>
              <span>Today</span>
            </div>
          </div>

          <div class="flex justify-start gap-6 mb-4">
            {#each currentStage.legend as item}
              <div class="legend-item">
                <div class="legend-box" style="background-color: {item.color};"></div>
                <span class="text-sm">{item.text}</span>
              </div>
            {/each}
          </div>
          
          <div class="map-container relative"
              style="
                max-width: 1200px; 
                aspect-ratio: 800 / 600;
                max-height: 800px;
              ">
            {#each stages as stage, i}
              <img 
                src="{base}/images/{stage.img}"
                alt={stage.label}
                class="map-layer"
                style="opacity: {getOpacity(i)};"
              />
            {/each}
          </div>
        </div>
        
        <div class="map-section my-12 font-inconsolata">
          <h2 class="text-2xl font-bold mb-4">Towns on the Cowboy Line</h2>
            <div class="flex flex-col items-start gap-4 mb-6">
          <p>The Cowboy Line stretched across Nebraska, hauling grain, lumber, South Dakotan bentonite, and Wyoming coal between the High Plains and the Midwest. Declining freight traffic in the 1970s and a damaging flood spelled the end of the line: its parent company abandoned the route in 1982.</p>

          <img 
            src="{base}/images/cowboy-line-towns.png" 
            alt="Towns on the Cowboy Line"
          />
    
          <p>The Cowboy Line and <span class="font-bold" style="color: #009999">its towns</span> were each others' lifebloods, each dependent on the other for survival.</p>
          <p>Hover over the squares below to watch the town populations change per decade.</p>

          <div id="observablehq-cowboyPops-9f24eaed"></div>
          <div id="observablehq-cowboyChange-9f24eaed"></div>
          
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
          <script type="module">
          import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
          import define from "https://api.observablehq.com/d/1c0349c84ac67657@447.js?v=4";
          new Runtime().module(define, name => {
            if (name === "cowboyPops") return new Inspector(document.querySelector("#observablehq-cowboyPops-9f24eaed"));
            if (name === "cowboyChange") return new Inspector(document.querySelector("#observablehq-cowboyChange-9f24eaed"));
          });
          </script>
        </div>
        </div>
        
      </div>
    </div>
    </div>
    </div>
  </div>

<style>

 .custom-range::-webkit-slider-thumb {
    background-color: var(--color-secondary);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .map-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity 0.3s ease-in-out;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-box {
    width: 20px;
    height: 2px;
    border-radius: 2px;
  }

  .map-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity 0.8s ease-in-out;
  }

</style>