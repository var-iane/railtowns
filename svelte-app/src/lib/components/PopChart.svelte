<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  // Props
  export let data = [];
  export let width = 800;
  export let margin = {top: 40, right: 20, bottom: 40, left: 40};
  export let rowHeight = 3;
  export let spacerHeight = 15;
  export let stateOrder = ["Montana", "North Dakota", "South Dakota", "Nebraska", "Kansas", "Oklahoma", "Texas"];
  export let highlightedPeriod = null;

  // Reactive variables
  let svg;
  let mounted = false;
  let hoveredData = null;

  // Filter and process data
  $: filteredData = processData(data);
  $: allYears = getAllYears(filteredData);
  $: processedLayout = createLayout(filteredData, stateOrder);
  $: height = margin.top + processedLayout.totalHeight + margin.bottom;
  $: if (highlightedPeriod) {
    highlightChartElements(highlightedPeriod);
  } else {
    clearHighlighting();
  }

  // PROCESS DATA FUNCTIONS

  function processData(rawData) {
    // First, filter out invalid data
    const validData = rawData.filter(d => d && !isNaN(d.PercentChange));
    
    // Group by town to find which towns have early data (1920 or earlier)
    const townGroups = d3.group(validData, d => d.Name);
    
    // Find towns that have data from 1920 or earlier
    const eligibleTowns = [];
    for (const [townName, townData] of townGroups) {
      const years = townData.map(d => +d.Year);
      const hasEarlyData = years.some(year => year <= 1920);
      if (hasEarlyData) {
        eligibleTowns.push(townName);
      }
    }
    
    // Filter data to only eligible towns, but keep ALL their years
    return validData.filter(d => eligibleTowns.includes(d.Name));
  }

  function getAllYears(data) {
    // Get all unique years from the filtered data, sorted
    return Array.from(new Set(data.map(d => +d.Year))).sort(d3.ascending);
  }

    // CREATE CHART FUNCTIONS

  function createLayout(data, stateOrder) {
    // Group by state
    const grouped = d3.group(data, d => d.State);
    
    // Create layout with state groupings
    const layout = [];
    let currentY = 0;
    const statePositions = [];
    
    for (const stateName of stateOrder) {
      if (!grouped.has(stateName)) continue;
      
      const stateData = grouped.get(stateName);
      const towns = Array.from(new Set(stateData.map(d => d.Name))).sort();
      
      const stateStartY = currentY;
      
      // Add each town in this state
      for (const townName of towns) {
        layout.push({
          town: townName,
          state: stateName,
          y: currentY
        });
        currentY += rowHeight;
      }
      
      statePositions.push({
        state: stateName,
        startY: stateStartY,
        endY: currentY,
        townCount: towns.length
      });
      
      // Add spacer after state (except for last state)
      currentY += spacerHeight;
    }
    
    return {
      layout,
      statePositions,
      totalHeight: currentY - spacerHeight // Remove last spacer
    };
  }


  function createScales() {
    const { layout } = processedLayout;
    
    const x = d3.scaleBand()
      .domain(allYears)
      .range([margin.left, width - margin.right])
      .padding(0);
    
    // Create y scale based on layout
    const yDomain = layout.map(d => d.town);
    const yRange = layout.map(d => margin.top + d.y);
    const y = d3.scaleOrdinal()
      .domain(yDomain)
      .range(yRange);
    
    // Color scale optimized for visibility
    const color = d3.scaleDiverging()
      .domain([-30, 0, 30]) // Adjusted domain for better visibility
      .interpolator(d3.interpolatePiYG);
    
    return { x, y, color };
  }

  function drawChart() {
    if (!mounted || !svg || !filteredData.length) return;
    
    const { layout, statePositions } = processedLayout;
    const { x, y, color } = createScales();
    
    // Clear previous content
    d3.select(svg).selectAll("*").remove();
    
    const svgSelection = d3.select(svg)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
    // Draw state separators
    svgSelection.append("g")
      .selectAll("line")
      .data(statePositions.slice(0, -1)) // Don't draw line after last state
      .join("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", d => margin.top + d.endY + spacerHeight/2)
        .attr("y2", d => margin.top + d.endY + spacerHeight/2)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);
    
    // Draw heatmap tiles
    svgSelection.append("g")
      .selectAll("rect")
      .data(filteredData)
      .join("rect")
        .attr("x", d => x(+d.Year))
        .attr("y", d => y(d.Name))
        .attr("width", x.bandwidth())
        .attr("height", rowHeight - 1) // Small gap between rows
        .attr("fill", d => color(+d.PercentChange))
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
          
          hoveredData = {
            name: d.Name,
            state: d.State,
            year: +d.Year,
            percentChange: +d.PercentChange,
            population: d.Population,
            x: event.pageX,
            y: event.pageY
          };
        })
        .on("mousemove", function(event) {
          if (hoveredData) {
            hoveredData.x = event.pageX;
            hoveredData.y = event.pageY;
          }
        })
        .on("mouseout", function() {
          d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5);
          hoveredData = null;
        })
        .on("click", function(event, d) {
          const clickEvent = new CustomEvent('heatmapClick', {
            detail: { data: d, event }
          });
          svg.dispatchEvent(clickEvent);
        });
    
    // X-axis (top)
    svgSelection.append("g")
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x)
        .tickValues(allYears.filter(y => y % 10 === 0)) // Show every 10 years
        .tickFormat(d3.format("d")))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick text")
        .style("font-size", "12px")
        .style("fill", "#666"));
    
    // Y-axis labels (town names)
    svgSelection.append("g")
      .selectAll("text")
      .data(layout)
      .join("text")
        .attr("x", margin.left - 5)
        .attr("y", d => margin.top + d.y + rowHeight/2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", "#333")
        .style("font-size", "10px")
        .text(d => d.town);
    
    // State labels
    svgSelection.append("g")
      .selectAll("text")
      .data(statePositions)
      .join("text")
        .attr("x", margin.left - 10)
        .attr("y", d => margin.top + d.startY + (d.endY - d.startY) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", "#666")
        .style("font-weight", "bold")
        .style("font-size", "12px")
        .text(d => d.state);
  }

// HIGHLIGHTING FUNCTIONS FOR INTERACTIVE ANNOTATIONS

  function highlightChartElements(period) {
  if (!mounted || !svg) return;
  
  const { states, years } = period.highlight;
  
  // First, dim all rectangles
  d3.select(svg)
    .selectAll("rect")
    .transition()
    .duration(200)
    .attr("opacity", 0.2);
  
  // Then highlight the matching ones
  d3.select(svg)
    .selectAll("rect")
    .filter(d => {
      const matchesState = states.includes(d.State);
      const matchesYear = years.includes(+d.Year);
      return matchesState && matchesYear;
    })
    .transition()
    .duration(200)
    .attr("opacity", 1)
    .attr("stroke", "#333")
    .attr("stroke-width", 2);
}

function clearHighlighting() {
  if (!mounted || !svg) return;
  
  // Reset all rectangles to normal state
  d3.select(svg)
    .selectAll("rect")
    .transition()
    .duration(200)
    .attr("opacity", 1)
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5);
}

// LIFECYCLE FUNCTIONS

  onMount(() => {
    mounted = true;
    drawChart();
  });

  afterUpdate(() => {
    drawChart();
  });
</script>

<div class="heatmap-container">
  <svg bind:this={svg} class="heatmap-svg"></svg>
  
  {#if hoveredData}
    <div 
      class="tooltip" 
      style="left: {hoveredData.x + 10}px; top: {hoveredData.y - 10}px;"
    >
      <div class="tooltip-content">
        <strong>{hoveredData.name}, {hoveredData.state}</strong><br>
        Year: {hoveredData.year}<br>
        Population: {hoveredData.population?.toLocaleString() || 'N/A'}<br>
        Change: {hoveredData.percentChange > 0 ? '+' : ''}{hoveredData.percentChange.toFixed(1)}%
      </div>
    </div>
  {/if}
</div>

<style>
  .heatmap-container {
    position: relative;
    width: 100%;
  }
  
  .heatmap-svg {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  .tooltip {
    position: fixed;
    pointer-events: none;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    max-width: 200px;
  }
  
  .tooltip-content {
    white-space: nowrap;
  }
</style>