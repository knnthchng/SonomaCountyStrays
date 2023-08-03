function renderChart(outcomeTypesDistribution) {
  // Create an SVG element for the bar chart with a margin
  const svg = d3.select("#outcome-types-chart")
    .append("svg")
    .attr("width", 600)
    .attr("height", 800)
    .append("g")
    .attr("transform", "translate(80, 80)");

  // Create x and y scales
  const x = d3.scaleBand()
    .domain(Object.keys(outcomeTypesDistribution))
    .range([0, 440])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.sum(Object.values(outcomeTypesDistribution))])
    .range([300, 0]);

  // Create and append the bars
  svg.selectAll(".bar")
    .data(Object.entries(outcomeTypesDistribution))
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", d => 300 - y(d[1]))
    .attr("fill", "#4CAF50");

  // Create and append the y-axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Create and append the x-axis
  svg.append("g")
    .attr("transform", "translate(0, 300)")
    .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
    .selectAll("text")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

  // Add a label for the chart
  svg.append("text")
    .attr("x", 220)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Outcome Types Distribution");

  // Add number labels at the top of each bar
  svg.selectAll(".top-label")
    .data(Object.entries(outcomeTypesDistribution))
    .enter().append("text")
    .attr("class", "top-label")
    .attr("x", d => x(d[0]) + x.bandwidth() / 2)
    .attr("y", d => y(d[1]) - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text(d => d[1]);

  // Add x axis label
  svg.append("text")
    .attr("x", 220)
    .attr("y", 330)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")

  // Add y axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -150)
    .attr("dy", "1em")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text("Number of Pets");
}

document.addEventListener('DOMContentLoaded', function() {
  renderChart(window.outcomeTypesDistribution);
});