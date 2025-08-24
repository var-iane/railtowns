<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  const annotations = [
    {
      id: 'railroads',
      title: 'Railroad Boom',
      period: '1880-1920',
      description: 'Towns flourish along new rail lines. Population grows as grain elevators and businesses establish.',
      color: 'text-green-600',
      // Highlight criteria for chart
      highlight: {
        states: ['Montana', 'North Dakota', 'South Dakota', 'Nebraska'],
        years: [1880, 1890, 1900, 1910, 1920]
      }
    },
    {
      id: 'dustbowl',
      title: 'The Dust Bowl',
      period: '1930-1936',
      description: 'Severe drought devastates Oklahoma and Kansas. Mass migration begins as farms fail.',
      color: 'text-orange-600',
      // Highlight criteria for chart
      highlight: {
        states: ['Oklahoma', 'Kansas'],
        years: [1930, 1940]
      }
    },
    {
      id: 'railclosure',
      title: 'Rail Line Closures',
      period: '1950-1980',
      description: 'Trucking replaces railroads. Branch lines close, cutting towns off from transportation networks.',
      color: 'text-red-600',
      highlight: {
        states: ['Montana', 'North Dakota', 'South Dakota'],
        years: [1950, 1960, 1970, 1980]
      }
    },
    {
      id: 'modernday',
      title: 'Modern Decline',
      period: '1980-Present',
      description: 'Young people leave for cities. Many towns drop below sustainable population levels.',
      color: 'text-gray-600',
      highlight: {
        states: ['Nebraska', 'Kansas', 'Oklahoma'],
        years: [1980, 1990, 2000, 2010]
      }
    }
  ];
  
  let activeAnnotation = null;
  
  function highlightPeriod(annotation) {
    activeAnnotation = annotation;
    // Send the entire annotation object with highlight criteria
    dispatch('highlight', annotation);
  }
  
  function clearHighlight() {
    activeAnnotation = null;
    dispatch('highlight', null);
  }
</script>

<div class="space-y-4">
  <h3 class="text-xl font-bold mb-4">Key Events</h3>

  <button 
    class="w-full text-left p-2 rounded border border-base-300 hover:bg-base-100 text-sm opacity-70"
    on:click={clearHighlight}
  >
    Clear highlights
  </button>
  
  {#each annotations as annotation}
      <button 
        class="w-full text-left p-3 rounded-lg border transition-all hover:bg-base-100 {activeAnnotation?.id === annotation.id ? 'bg-base-100 border-primary' : 'border-base-300'}"
        on:click={() => highlightPeriod(annotation)}
      >
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-current {annotation.color}"></div>
          <h4 class="font-semibold">{annotation.title}</h4>
        </div>
        <p class="text-sm opacity-70 mb-1">{annotation.period}</p>
        <p class="text-sm">{annotation.description}</p>
        
        <!-- Debug info showing what will be highlighted -->
        {#if activeAnnotation?.id === annotation.id}
          <div class="mt-2 text-xs opacity-60">
            <p>States: {annotation.highlight.states.join(', ')}</p>
            <p>Years: {annotation.highlight.years.join(', ')}</p>
          </div>
        {/if}
      </button>
    {/each}
</div>