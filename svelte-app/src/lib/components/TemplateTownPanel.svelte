<script>
  import { gsap } from "gsap";

  let { towns = [], currentTownIndex } = $props();

  let townElements = $state([]);
  let legend = $state(null);
  let description = $state(null);
  let shownIndex = $state(-1); // this will decide which town's description is displayed so I can get a flickering effect

  const CROP_W = 600;
  const CROP_H = 480;
  let areaW = $state(0);
  let areaH = $state(0);
  const scale = $derived(Math.min(areaW / CROP_W, areaH / CROP_H, 1));

  $effect(() => {
    const index = currentTownIndex;
    if (!legend || !description || townElements.length === 0) return;

    townElements.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        opacity: i === index ? 1 : 0,
        duration: 0.2,
        delay: i === index ? 0.3 : 0,
        ease: "power2.out",
        overwrite: true,
      });
    });

    gsap.to(legend, {
      opacity: index >= 0 ? 1 : 0,
      duration: index >= 0 ? 0.2 : 0.1,
      delay: index >= 0 ? 0.3 : 0,
      ease: "power2.out",
      overwrite: true,
    });

    const tl = gsap.timeline();
    tl.to(description, { opacity: 0, duration: 0.2, ease: "power2.out" })
      .call(() => (shownIndex = index), null, 0.2);
    if (index >= 0) {
      tl.to(description, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0.3);
    }

    return () => tl.kill();

    // gsap.to(description, {
    //   opacity: index >= 0 ? 1 : 0,
    //   duration: index >= 0 ? 0.2 : 0.1,
    //   delay: index >= 0 ? 0.3 : 0,
    //   ease: "power2.out",
    //   overwrite: true,
    // });
  });
</script>

<div class="panel">
  <ul class="town-legend" bind:this={legend} style="opacity: 0;">
    <li>
      <span class="swatch" style="background-color: var(--color-blue);"
      ></span>Chestnut
    </li>
    <li>
      <span class="swatch" style="background-color: var(--color-offwhite);"
      ></span>Template grid
    </li>
    <li>
      <span class="swatch" style="background-color: var(--color-pink);"
      ></span>Oak
    </li>
  </ul>

  <div class="svg-area" bind:clientWidth={areaW} bind:clientHeight={areaH}>
    {#each towns as town, i}
      <div
        class="town town{String(i + 1).padStart(2, '0')}"
        bind:this={townElements[i]}
        style="opacity: 0; width: {CROP_W * scale}px; height: {CROP_H *
          scale}px;"
      >
        <div
          class="masked-svg"
          style="width: {CROP_W}px; height: {CROP_H}px; transform: scale({scale}); transform-origin: top left;"
        >
          {@html town.svg}
        </div>
      </div>
    {/each}
  </div>

  <p class="description" bind:this={description} style="opacity: 0;">
    {#if shownIndex >= 0}
      {@html towns[shownIndex]?.description}
    {/if}
  </p>
</div>

<style>
  .panel {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
    background-color: var(--color-base-100);
    pointer-events: auto;
  }

  .town-legend,
  .description {
    flex-shrink: 0;
    width: 100%;
    max-width: 600px;
    text-align: center;
    border-radius: 0.25rem;
  }

  .town-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 1.5rem;
    padding: 0.5rem;
    list-style: none;
    font-family: var(--font-main);
    font-size: 0.875rem;
    background-color: var(--color-base-200);
  }
  .town-legend li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .swatch {
    width: 20px;
    height: 3px;
    border-radius: 1px;
  }

  .svg-area {
    position: relative;
    flex: 0 1 auto;
    width: 100%;
    max-width: 600px;
    aspect-ratio: 600 / 480;
    min-height: 0;
  }

  .masked-svg {
    overflow: hidden;
    font-family: var(--font-main);
  }

  .town {
    position: absolute;
    inset: 0;
    margin: auto;
  }

  .description {
    padding: 1rem;
    margin: 0;
    min-height: 60px;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-base-200);
  }

  /* champaign-specific */
  :global(.town03 .chestnut),
  :global(.town03 .oak) {
    stroke-width: 2;
  }
  :global(.town03 .rail) {
    stroke-width: 1.5;
  }
  :global(.town03 .grid) {
    stroke-width: 0.75;
  }

  /* centralia-specific */
  :global(.town07 .chestnut),
  :global(.town07 .oak) {
    stroke-width: 3;
  }
  :global(.town07 .rail) {
    stroke-width: 2;
  }
  :global(.town07 .grid) {
    stroke-width: 0.75;
  }

  @media (max-width: 767px) {
    .panel {
      gap: 0.5rem;
      padding: 0.5rem 1rem;
    }
    .town-legend {
      padding: 0.4rem 0.75rem;
      gap: 0.25rem 1rem;
      font-size: 0.75rem;
    }
    .description {
      padding: 0.4rem 0.75rem;
      min-height: 0;
      font-size: 1rem;
    }
  }
</style>
