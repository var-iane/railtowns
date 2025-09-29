<script>

  import { base } from '$app/paths';

</script>

<svelte:head>
  <title>Artery Towns</title>
</svelte:head>

<div class="page-container">
 <div class="narrative-section">
  <div class="narrative-content text-md leading-relaxed">
    <h1 class="text-4xl font-bold">Artery towns</h1>
      <p>
        Rail towns depend on the rail lines that go through them, and vice versa. What happened to these towns when their rail lines were abandoned?
      </p>
      <p>
        This part is coming soon!
      </p>
      <!-- <img src="{base}/images/us-rail-all.svg" alt="Historical US Railroad Network" /> -->

      <!-- Responsive SVG container -->
      <div class="w-full flex justify-center">
        <div class="relative w-full text-center" 
              style="
                max-width: 800px; 
                aspect-ratio: 800 / 600;
                max-height: 600;
              ">
          <div class="masked-svg" 
                style="
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                ">
            <img src="{base}/images/us-rail-current.svg" alt="Current US Railroad Network" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>