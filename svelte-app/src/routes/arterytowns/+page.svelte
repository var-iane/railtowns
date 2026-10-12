<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";

  let showCurrent = $state(false);
  let sliderValue = $state(0);

  const stages = [
    {
      img: "plains-boom.png",
      label: "Boom times",
      legend: [{ color: "#ffa000", text: "Active lines" }],
    },
    {
      img: "plains-abandoned.png",
      label: "Hard times and abandoned lines",
      legend: [
        { color: "#ffa000", text: "Active lines" },
        { color: "#444872", text: "Abandoned lines" },
      ],
    },
    {
      img: "plains-places.png",
      label: "Towns on the ghost lines",
      legend: [
        { color: "#ffa000", text: "Active lines" },
        { color: "#009999", text: "Towns along abandoned routes" },
      ],
    },
  ];

  const stageOpacity = (i) => Math.max(0, 1 - Math.abs(sliderValue / 50 - i));

  const currentStage = $derived(stages[Math.round(sliderValue / 50)]);

  onMount(async () => {
    const [{ Runtime, Inspector }, { default: define }] = await Promise.all([
      import(
        /* @vite-ignore */ "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js"
      ),
      import(
        /* @vite-ignore */ "https://api.observablehq.com/d/1c0349c84ac67657@447.js?v=4"
      ),
    ]);

    const targets = {
      cowboyPops: "#observablehq-cowboyPops-9f24eaed",
      cowboyChange: "#observablehq-cowboyChange-9f24eaed",
    };

    new Runtime().module(define, (name) => {
      if (name in targets) {
        return new Inspector(document.querySelector(targets[name]));
      }
    });
  });
</script>

<svelte:head>
  <title>Artery towns</title>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css"
  />
</svelte:head>

<div class="page">
  <h1>Artery towns</h1>
  <p>
    For a golden period around 1900 to 1950, the country was cloaked
    east-to-west in 200,000+ miles of rail tracks that carried both <span
      class="gold">passengers and freight cargo</span
    >.
  </p>
  <p>
    But with the construction of the interstate highway and rise of commercial
    aviation in the 1950s and 60s, cars and planes quickly became Americans'
    preferred ways to get around.
    <!-- Route-miles of passenger service dropped from about 107,000 miles in 1958; to 49,000 miles in 1970; to 21,000 miles today. -->
  </p>
  <p>
    Many lines turned into <span class="teal">freight-only</span> routes, making
    profits off cargo instead.
  </p>
  <p>
    Other routes hemorrhaged money. Between the late 1960s and 1990s, struggling
    rail companies began <span class="indigo">abandoning lines</span> altogether:
    about 80,000 miles in total.
  </p>
  <!-- <p>
            Rural railroad towns managed to hang on to passenger rail until 1967, thanks to the U.S. Post Office.
          </p>
          <p>Most passenger routes weren't actually profitable for railroad companies, but since the mid-1800s, the Post Office had kept them alive by contracting the rails to carry, sort, and deliver mail aboard special "Railway Post Office" cars hitched to fast passenger trains. Postal clerks worked on the move, sorting letters by hand and hurling and snatching mailbags as the trains whizzed by tiny town stations at 70 miles per hour.</p>
          <p>By 1967, the Post Office couldn't resist the allure of modernization: planes, trucks, and regional (stationary) sorting centers. Without their biggest customer, most passenger routes died. </p> -->
  <p>
    Amtrak took over the scraps of passenger rail in 1970. Today, only 21,000
    miles of rail serve passengers. The vast majority of track carries only
    freight.
  </p>

  <p></p>

  <div class="map-section">
    <h2>The retreat of American passenger rail</h2>

    <div class="toggle-row">
      <span class:dim={showCurrent}>Rails a century ago</span>
      <input
        type="checkbox"
        class="toggle bg-secondary text-base-content checked:bg-secondary checked:text-base-content border-2 border-base-300"
        bind:checked={showCurrent}
      />
      <span class:dim={!showCurrent}>Rails now</span>
    </div>

    <div class="legend">
      <div class="legend-item">
        <div class="legend-box" style="background-color: #ffa000;"></div>
        <span>Passenger + freight</span>
      </div>
      {#if showCurrent}
        <div class="legend-item">
          <div class="legend-box" style="background-color: #009999;"></div>
          <span>Freight only</span>
        </div>
        <div class="legend-item">
          <div class="legend-box" style="background-color: #444872;"></div>
          <span>Abandoned track</span>
        </div>
      {/if}
    </div>

    <div class="map-frame" style="--fade: 0.3s;">
      <img
        class="map-layer"
        src="{base}/images/rails-before.png"
        alt="Rails then"
        style="opacity: {showCurrent ? 0 : 1};"
      />
      <img
        class="map-layer"
        src="{base}/images/rails-now-types.png"
        alt="Rails now"
        style="opacity: {showCurrent ? 1 : 0};"
      />
    </div>
  </div>

  <div class="map-section">
    <h2>Abandoned lines in the Great Plains</h2>
    <p>
      <span class="indigo">Abandoned routes</span>, and
      <span class="teal">their towns</span>, flank the plains of North Dakota,
      South Dakota, and Nebraska.
    </p>

    <p class="stage-label">
      {currentStage.label}
    </p>
    <input
      type="range"
      min="0"
      max="100"
      bind:value={sliderValue}
      class="range range-secondary slider"
    />
    <div class="slider-labels">
      <span>1920s</span>
      <span>1980s</span>
      <span>Today</span>
    </div>
  </div>

  <div class="legend">
    {#each currentStage.legend as item}
      <div class="legend-item">
        <div class="legend-box" style="background-color: {item.color};"></div>
        <span>{item.text}</span>
      </div>
    {/each}
  </div>

  <div class="map-frame">
    {#each stages as stage, i}
      <img
        class="map-layer"
        src="{base}/images/{stage.img}"
        alt={stage.label}
        style="opacity: {stageOpacity(i)};"
      />
    {/each}
  </div>
</div>

<div class="map-section">
  <h2>Towns on the Cowboy Line</h2>
  <p>
    The Cowboy Line stretched across Nebraska, hauling grain, lumber, South
    Dakotan bentonite, and Wyoming coal between the High Plains and the Midwest.
    Declining freight traffic in the 1970s and a damaging flood spelled the end
    of the line: its parent company abandoned the route in 1982.
  </p>

  <img
    src="{base}/images/cowboy-line-towns.png"
    alt="Towns on the Cowboy Line"
  />

  <p>
    The Cowboy Line and <span class="teal">its towns</span> were each dependent on
    the other for survival.
  </p>

  <p>
    Hover over the squares below to explore how the town populations changed per
    decade.
  </p>

  <div class="observable-row">
    <div id="observablehq-cowboyPops-9f24eaed"></div>
    <div id="observablehq-cowboyChange-9f24eaed"></div>
  </div>
</div>

<style>
  .gold,
  .teal,
  .indigo {
    font-weight: 700;
  }
  .gold {
    color: #ffa000;
  }
  .teal {
    color: #009999;
  }
  .indigo {
    color: #444872;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.125rem;
    font-weight: 500;
  }
  .dim {
    opacity: 0.3;
  }

  .map-frame {
    position: relative;
    width: 100%;
    max-width: 1200px;
    max-height: 800px;
    aspect-ratio: 800 / 600;
    margin-inline: auto;
  }
  .map-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity var(--fade, 0.8s) ease-in-out;
  }

  .stage-label {
    font-size: 1.125rem;
  }
  .slider {
    width: 100%;
    max-width: 28rem;
  }
  .slider::-webkit-slider-thumb {
    background-color: var(--color-secondary);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .slider-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 28rem;
    font-size: 0.875rem;
  }

  .observable-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
