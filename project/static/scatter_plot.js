function filterData(petType, primaryBreed, scatterPlotData) {
  return scatterPlotData.filter(d => d.petType === petType && d.primaryBreed === primaryBreed);
}

function drawScatterPlot(petType, primaryBreed, scatterPlotData) {
  // Clear the existing plot
  const scatterPlotElement = d3.select("#scatter-plot");
  scatterPlotElement.selectAll("*").remove();

  const filteredData = filterData(petType, primaryBreed, scatterPlotData);

  // Set the dimensions and margins of the graph
  const margin = { top: 50, right: 40, bottom: 80, left: 100 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append the svg object to the body of the page
  const svg = scatterPlotElement
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis label
  svg.append("text")
    .attr("class", "x-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom / 2)
    .style("text-anchor", "middle")
    .text("Age")
    .style("font-size", "14px")
    .style("font-weight", "bold");

  // Add Y axis label
  svg.append("text")
    .attr("class", "y-label")
    .attr("x", -height / 2)
    .attr("y", -margin.left / 2)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Number of Days in Shelter")
    .style("font-size", "14px")
    .style("font-weight", "bold");

  // Add X axis
  const x = d3.scaleLinear().domain([0, d3.max(filteredData, d => d.age)]).range([0, width]);
  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)).selectAll("text").style("font-size", "12px");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, d3.max(filteredData, d => d.daysInShelter)]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y)).selectAll("text").style("font-size", "12px");

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.age))
    .attr("cy", d => y(d.daysInShelter))
    .attr("r", 3)
    .style("fill", "#69b3a2");

  // Add scatter plot title
  svg
    .append("text")
    .attr("class", "scatter-title")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("fill", "#333")
    .text("Age vs. Days in Shelter")
}

// Update the scatter plot based on the selected pet type and primary breed
function updateScatterPlot() {
  const petType = document.getElementById("pet_type").value;
  const primaryBreed = document.getElementById("primary_breed").value;
  drawScatterPlot(petType, primaryBreed, window.scatterPlotData);
}

// Load the data and initialize the scatter plot
d3.csv("scatter_plot_data.csv").then(data => {
  // Convert numeric values to numbers
  data.forEach(d => {
    d.age = +d.age;
    d.daysInShelter = +d.daysInShelter;
  });

  // Save the data to the global scope
  window.scatterPlotData = data;

  // Initialize the scatter plot with the default pet type and primary breed
  const defaultPetType = document.getElementById("pet_type").value;
  const defaultPrimaryBreed = document.getElementById("primary_breed").value;
  drawScatterPlot(defaultPetType, defaultPrimaryBreed, data);
});
