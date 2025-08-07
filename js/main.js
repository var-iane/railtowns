import { drawHeatmap } from "./heatmap.js";
// import { drawLineChart } from "./linechart.js"; // add later

d3.csv("../data/town_populations.csv", d => ({
  Name: d.Name,
  State: d.State,
  Year: +d.Year,
  Population: +d.Population.replace(/,/g, ''),
  PercentChange: parseFloat((d["Percent change"] || "").replace('%', '').replace('−', '-'))
})).then(towns_data => {
  drawHeatmap(towns_data);
  // drawLineChart(towns_data); // future
});