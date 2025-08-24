<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  // Props
  export let data = [];
  export let width = 1000; // Increased width for horizontal layout
  export let margin = {top: 40, right: 40, bottom: 80, left: 60}; // Adjusted margins
  export let colWidth = 2; // Width of each town column
  export let spacerWidth = 20; // Space between state groups
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
  $: width = margin.left + processedLayout.totalWidth + margin.right; // Dynamic width
  $: if (highlightedPeriod) {
    highlightChartElements(highlightedPeriod);
  } else {
    clearHighlighting();
  }

  // PROCESS DATA FUNCTIONS

  function processData(rawData) {
    const validData = rawData.filter(d => d && !isNaN(d.PercentChange));
    
    const townGroups = d3.group(validData, d => d.Name);
    
    const eligibleTowns = [];
    for (const [townName, townData] of townGroups) {
      const years = townData.map(d => +d.Year);
      const hasEarlyData = years.some(year => year <= 1920);
      if (hasEarlyData) {
        eligibleTowns.push(townName);
      }
    }
    
    return validData.filter(d => eligibleTowns.includes(d.Name));
  }

  function getAllYears(data) {
    return Array.from(new Set(data.map(d => +d.Year))).sort(d3.ascending);
  }

  // CREATE CHART FUNCTIONS

  function createLayout(data, stateOrder) {
    const grouped = d3.group(data, d => d.State);
    
    const layout = [];
    let currentX = 0; // Now tracking X position instead of Y
    const statePositions = [];
    
    for (const stateName of stateOrder) {
      if (!grouped.has(stateName)) continue;
      
      const stateData = grouped.get(stateName);
      const towns = Array.from(new Set(stateData.map(d => d.Name))).sort();
      
      const stateStartX = currentX;
      
      // Add each town in this state
      for (const townName of towns) {
        layout.push({
          town: townName,
          state: stateName,
          x: currentX // X position instead of Y
        });
        currentX += colWidth; // Move right instead of down
      }
      
      statePositions.push({
        state: stateName,
        startX: stateStartX, // X positions instead of Y
        endX: currentX,
        townCount: towns.length
      });
      
      // Add spacer after state (except for last state)
      currentX += spacerWidth;
    }
    
    return {
      layout,
      statePositions,
      totalWidth: currentX - spacerWidth // Total width instead of height
    };
  }

  function createScales() {
    const { layout } = processedLayout;
    
    // Y scale for years (top to bottom: early to late)
    const y = d3.scaleBand()
      .domain(allYears)
      .range([margin.top, 400]) // Fixed height for years
      .padding(0);
    
    // X scale for towns (left to right)
    const xDomain = layout.map(d => d.town);
    const xRange = layout.map(d => margin.left + d.x);
    const x = d3.scaleOrdinal()
      .domain(xDomain)
      .range(xRange);
    
    // Color scale
    const color = d3.scaleDiverging()
      .domain([-30, 0, 30])
      .interpolator(d3.interpolatePiYG);
    
    return { x, y, color };
  }

  function drawChart() {
    if (!mounted || !svg || !filteredData.length) return;
    
    const { layout, statePositions } = processedLayout;
    const { x, y, color } = createScales();
    const height = margin.top + 400 + margin.bottom; // Fixed height
    
    // Clear previous content
    d3.select(svg).selectAll("*").remove();
    
    const svgSelection = d3.select(svg)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
    // Draw state separators (vertical lines)
    svgSelection.append("g")
      .selectAll("line")
      .data(statePositions.slice(0, -1))
      .join("line")
        .attr("x1", d => margin.left + d.endX + spacerWidth/2)
        .attr("x2", d => margin.left + d.endX + spacerWidth/2)
        .attr("y1", margin.top)
        .attr("y2", margin.top + 400)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);
    
    // Draw heatmap tiles
    svgSelection.append("g")
      .selectAll("rect")
      .data(filteredData)
      .join("rect")
        .attr("x", d => x(d.Name)) // X based on town name
        .attr("y", d => y(+d.Year)) // Y based on year
        .attr("width", colWidth - 1) // Small gap between columns
        .attr("height", y.bandwidth())
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
    
    // Y-axis (left side - years)
    svgSelection.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y)
        .tickValues(allYears.filter(year => year % 10 === 0)) // Every 10 years
        .tickFormat(d3.format("d")))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick text")
        .style("font-size", "12px")
        .style("fill", "#666"));
    
    // X-axis labels (bottom - town names)
    svgSelection.append("g")
      .selectAll("text")
      .data(layout)
      .join("text")
        .attr("x", d => margin.left + d.x + colWidth/2)
        .attr("y", margin.top + 400 + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .style("font-size", "9px")
        .text(d => d.town)
        .attr("transform", d => `rotate(-45, ${margin.left + d.x + colWidth/2}, ${margin.top + 400 + 15})`);
    
    // State labels (bottom - centered under each state group)
    svgSelection.append("g")
      .selectAll("text")
      .data(statePositions)
      .join("text")
        .attr("x", d => margin.left + d.startX + (d.endX - d.startX) / 2)
        .attr("y", margin.top + 400 + 50)
        .attr("text-anchor", "middle")
        .attr("fill", "#666")
        .style("font-weight", "bold")
        .style("font-size", "14px")
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
    overflow-x: auto; /* Allow horizontal scrolling if needed */
  }
  
  .heatmap-svg {
    max-width: none; /* Remove width constraint */
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