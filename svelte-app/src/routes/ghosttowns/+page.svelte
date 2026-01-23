<script>

  import { base } from '$app/paths';
  import montanaSat from '$lib/assets/svg/northwest-rail-satellite.svg?raw';

</script>

<svelte:head>
  <title>Ghost towns</title>
</svelte:head>

<div class="page-container">
 <div class="narrative-section">
  <div class="narrative-content text-md leading-relaxed">
    <h1 class="text-4xl font-bold">Ghost towns</h1>
    <p>
      The plains of eastern Montana are typically dry, dusty, and inhospitable to farming. But to make money and continue building west in the early 1900s, the transcontinental railroads aggressively marketed the area to homesteaders as a green, fertile “farmer's paradise.”
    </p>
    <p>
      The timing was lucky, coinciding with an unusual wet spell in the state between 1909 and 1917 that fueled an intense agricultural boom. The state's population exploded.
    </p>  
    <p>
      But by 1918, punishing drought had returned, and the end of World War I sank demand for wheat. Farms failed, and towns that had sprung up just the previous decade were abandoned.
    </p> 

    <div class="map-section my-12 font-inconsolata">
      <h2 class="text-2xl font-bold mb-4">An ill-fated line</h2>
        <div class="flex flex-col items-start gap-4 mb-6">
          <p>
            The Milwaukee Road was one of many rail companies vying to reach the West Coast. It built its Pacific Extension from South Dakota to Seattle/Tacoma, through Montana, between 1906 and 1909.
          </p>
          <p>It was the last transcontinental route to be built across the U.S.</p>
          <p>
            The extension ran into financial problems from the start. To lay claim to "the shortest route to the Pacific," it cut through two massive mountain ranges, traversing steep grades and winding curves. Steam trains struggled in the frigid winter temperatures of the northern states, so the company decided to electrify a long stretch of this new track — the longest of its kind in the country.
          </p>
          <p>
            The Milwaukee was also late to the land game; other railroads had already built routes through the state's best agricultural regions. The Milwaukee chose a path that went right through the arid plains.
          </p>

          <!-- {@html montanaSat} -->

          <div class="w-full flex justify-center">
          <div class="relative w-full text-center" 
              style="
                max-width: 1200px; 
              "
              >
            <img src="{base}/images/northwest-rail-satellite.png" alt="Satellite map of lines through Montana" />
        </div>
      </div>
          
          <p>
            Of the small towns that cropped up as station stops along the Milwaukee, some didn't make it past the 1918 drought. Others hung on until the company filed for bankruptcy and abandoned its route west of Miles City, Montana in 1980.
          </p>
          
          <!-- <img src="{base}/images/montana-towns.png" alt="Abandoned towns on Milwaukee Road" /> -->
          
        </div>
      </div>

    
      <!-- <div class="w-full flex justify-center">
        <div class="relative w-full text-center" 
              style="
                max-width: 400px; 
              "
              >
            <img src="{base}/images/mt-vananda-over.jpg" alt="Satellite view of Vananda, Montana, from Google Earth" />
        </div>
      </div> -->
      <div class="w-full flex justify-center">
        <div class="relative w-full text-center" 
              style="
                max-width: 600px; 
              "
              >
            <img src="{base}/images/mt-vananda-stview2.jpg" alt="Streetview of Vananda, Montana, from Google Earth" />
        </div>
      </div>
        <div class="w-full flex justify-center">
          <p>Dirt trails where the Milwaukee Road once ran through Vananda, Montana.</p>
        </div>

      <div class="w-full flex justify-center">
      <div class="relative w-full text-center" 
            style="
              max-width: 600px; 
            "
            >
          <img src="{base}/images/mt-loweth-stview2.jpg" alt="Streetview of Loweth, Montana, from Google Earth" />
      </div>
      </div>
      <div class="w-full flex justify-center">
        <p>This electrical substation in Loweth, Montana once powered the Milwaukee Road. It's now the only structure for miles.</p>
      </div>

    </div>
  </div>
</div>