<script>
  import TemplateMapPanel from "$lib/components/TemplateMapPanel.svelte";
  import TemplateTownPanel from "$lib/components/TemplateTownPanel.svelte";

  import town01 from "$lib/assets/svg/town-01.svg?raw";
  import town02 from "$lib/assets/svg/town-02.svg?raw";
  import town03 from "$lib/assets/svg/town-03.svg?raw";
  import town04 from "$lib/assets/svg/town-04.svg?raw";
  import town05 from "$lib/assets/svg/town-05.svg?raw";
  import town06 from "$lib/assets/svg/town-06.svg?raw";
  import town07 from "$lib/assets/svg/town-07.svg?raw";
  import town08 from "$lib/assets/svg/town-08.svg?raw";
  import townModel from "$lib/assets/svg/town-model.svg?raw";

  const towns = [
    { name: "Chebanse", svg: town01, description: `Chebanse, Illinois` },
    { name: "Onarga", svg: town02, description: `Onarga, Illinois` },
    { name: "Champaign", svg: town03, description: `Champaign, Illinois` },
    { name: "Arcola", svg: town04, description: `Arcola, Illinois` },
    { name: "Neoga", svg: town05, description: `Neoga, Illinois` },
    { name: "Farina", svg: town06, description: `Farina, Illinois` },
    { name: "Centralia", svg: town07, description: `Centralia, Illinois` },
    { name: "Tamaroa", svg: town08, description: `Tamaroa, Illinois` },
  ];

  let currentTownIndex = $state(-1); // before any town
  let narrativeOpacity = $state(1);
  let townPanelOpacity = $state(1);

  const updateTownIndex = (i) => (currentTownIndex = i);

  function handleFade(narrative, townPanel) {
    narrativeOpacity = narrative;
    townPanelOpacity = townPanel;
  }

  const MODEL_W = 375;
  const MODEL_H = 300;
  let modelBoxW = $state(0);
  let modelBoxH = $state(0);
  const modelScale = $derived(
    Math.min(modelBoxW / MODEL_W, modelBoxH / MODEL_H, 1),
  );
</script>

<svelte:head>
  <title>Template towns</title>
</svelte:head>

<div class="page">
  <div class="stage">
    <div
      class="narrative"
      style="opacity: {narrativeOpacity};"
      style:pointer-events={narrativeOpacity > 0.05 ? "auto" : "none"}
    >
      <div class="narrative-content">
        <h1>Template towns</h1>
        <p>
          The Illinois Central Railroad gets tapped first. It gets free land, the directive to start building... and a deadline.
        </p>
        <p>
          The company needs to fill the growing rail with customers, fast. So it simply makes town templates. Every few miles of new track, it stamps down a pre-designed town, <span
            class="text-grid font-bold">street grid</span
          > angled along the
          <span class="text-rail font-bold">tracks</span>.
        </p>
        <p>
          Here's one template. Streets parallel to the tracks are named for
          trees, always in this same order. <span class="text-chestnut font-bold"
            >Chestnut Street</span
          >
          and <span class="text-oak font-bold">Oak Street</span> always sandwich the
          tracks. Cross streets are numbered or named after presidents.
        </p>
  
        <div
          class="model"
          bind:clientWidth={modelBoxW}
          bind:clientHeight={modelBoxH}
        >
          <div
            class="model-window"
            style="width: {MODEL_W * modelScale}px; height: {MODEL_H *
              modelScale}px;"
          >
            <div
              class="model-crop"
              style="width: {MODEL_W}px; height: {MODEL_H}px; transform: scale({modelScale}); transform-origin: top left;"
            >
              {@html townModel}
            </div>
          </div>
        </div>
  
        <p>
          Today, these street grids still define the small towns, and old downtowns
          of big cities, along the Illinois Central.
        </p>
        <p class="text-rail">
          Scroll to visit template towns along the line ↓
        </p>
      </div>
    </div>
  
    <div class="town-panel" style="opacity: {townPanelOpacity};">
      <TemplateTownPanel {towns} {currentTownIndex} />
    </div>
  
    <div class="map-panel">
      <TemplateMapPanel {towns} {updateTownIndex} onFade={handleFade} />
    </div>
  </div>
</div>

<!-- the scroll-container height is number of towns x 100% of viewport/screen height + a full screen height for narrative section + a full screen height for end of railroad path: each town gets ~1 full screen height of scroll to animate through 
   TemplateMapPanel uses the same towns + 2 math-->
<div
  id="scroll-container"
  style="height: {(towns.length + 2) * 100}vh; margin-top: 100vh;"
></div>

<style>
  .stage {
    position: fixed;
    top: var(--navbar-height);
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: minmax(400px, 60%) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
  }

  .narrative,
  .town-panel {
    grid-column: 1;
    grid-row: 1;
    min-height: 0;
  }

  .map-panel {
    grid-column: 2;
    grid-row: 1;
    min-height: 0;
  }

  .narrative {
    z-index: 20;
    display: flex;
    flex-direction: column;
    padding: clamp(0.5rem, 2dvh, 2rem) 1rem;
    font-size: clamp(0.9rem, 1.2dvh + 0.4rem, 1rem);
    background-color: var(--color-base-100);
    overflow: hidden;
  }

  .narrative-content {
    width: 100%;
    max-width: 48rem;
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    gap: clamp(0.35rem, 1.5dvh, 1rem);
  }

  .town-panel {
    z-index: 10;
  }

  .model {
    width: 100%;
    max-width: 400px;
    height: clamp(150px, 32dvh, 300px);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .model-window {
    flex-shrink: 0;
  }

  .model-crop {
    overflow: hidden;
  }

  @media (max-height: 640px) {
    .narrative-content h1 {
      font-size: 1.75rem;
    }
  }

  @media (max-width: 767px) {
    .stage {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(0, 42fr) minmax(0, 58fr);
    }
    .map-panel {
      grid-column: 1;
      grid-row: 1;
    }
    .town-panel {
      grid-column: 1;
      grid-row: 2;
    }

    .narrative {
      grid-column: 1;
      grid-row: 1 / -1;
      line-height: 1.4;
    }

    .model {
      height: clamp(110px, 24dvh, 300px);
    }
  }
</style>
