export function drawHeatmap(towns_data) {
  const requiredYears = new Set(d3.range(1930, 2030, 10));
  const dataByTown = d3.group(towns_data, d => d.Name);
  const validTowns = new Set(
    Array.from(dataByTown.entries())
      .filter(([_, records]) => {
        const years = new Set(records.map(d => d.Year));
        return Array.from(requiredYears).every(y => years.has(y));
      })
      .map(([name, _]) => name)
  );

  const data = towns_data
    .filter(d => !isNaN(d.PercentChange) && validTowns.has(d.Name))
    .sort((a, b) =>
      d3.ascending(a.State, b.State) || d3.ascending(a.Name, b.Name)
    );

  const margin = {top: 20, right: 20, bottom: 40, left: 60};
  const rowHeight = 10;
  const width = 800;
  const towns = Array.from(new Set(data.map(d => d.Name)));
  const years = Array.from(new Set(data.map(d => d.Year))).sort(d3.ascending);
  const height = rowHeight * towns.length + margin.top + margin.bottom;

  const x = d3.scaleBand()
    .domain(years)
    .range([margin.left, width - margin.right])
    .padding(0.05);

  const y = d3.scaleBand()
    .domain(towns)
    .range([margin.top, height - margin.bottom])
    .padding(0.05);

  const color = d3.scaleDiverging()
    .domain([-100, 0, 100])
    .interpolator(d3.interpolatePuOr);

  const townToState = new Map(data.map(d => [d.Name, d.State]));

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.Year))
      .attr("y", d => y(d.Name))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d.PercentChange))
    .append("title")
      .text(d => `${d.Name}, ${d.Year}: ${d.PercentChange}%`);

  svg.append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).tickValues(years.filter(y => y % 10 === 0)).tickFormat(d3.format("d")))
    .call(g => g.select(".domain").remove());

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(0).tickFormat(() => ""))
    .call(g => g.select(".domain").remove());

  const stateLabels = Array.from(
    d3.group(towns, name => townToState.get(name)),
    ([state, names]) => ({
      state,
      position: d3.mean(names.map(name => y(name))) + y.bandwidth() / 2
    })
  );

  svg.append("g")
    .selectAll("text.state-label")
    .data(stateLabels)
    .join("text")
      .attr("x", 5)
      .attr("y", d => d.position)
      .attr("dy", "0.35em")
      .style("font-weight", "bold")
      .style("font-size", "10px")
      .text(d => d.state);

  svg.append("g")
    .selectAll("line.state-divider")
    .data(stateLabels.slice(1))
    .join("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", d => d.position - y.bandwidth())
      .attr("y2", d => d.position - y.bandwidth())
      .attr("stroke", "#aaa")
      .attr("stroke-dasharray", "2,2");

  document.getElementById("heatmap").appendChild(svg.node());
}