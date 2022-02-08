export const renderIncome = (selector, props) => {
  // props --> do this to make graph more modular
  const { data, width, height, title, xProp, yProp, colorScale } = props;

  // variables
  const xValue = (d) => d[xProp];
  const yValue = (d) => d[yProp];

  const graphG = selector.append("g").attr("transform", "translate(35,35)");

  // scales
  const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);

  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([0, height])
    .padding(0.1);

  const xAxisTickFormat = (number) => number + "%";

  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-height);

  const yAxisG = graphG
    .append("g")
    .attr("class", "graph-primary")
    .call(d3.axisLeft(yScale));
  yAxisG
    .selectAll(".tick text")
    .attr("text-anchor", "start")
    .attr("x", -80)
    .attr("font-weight", "bold")
    .attr("font-size", "12px");
  yAxisG.selectAll(".domain, .tick line").remove();

  const xAxisG = graphG
    .append("g")
    .attr("class", "graph-primary")
    .call(xAxis)
    .attr("transform", `translate(0,${height})`);

  xAxisG.select(".domain").remove();

  graphG
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", (d) => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => colorScale(d[yProp]));

  selector
    .append("text")
    .attr("class", "title fill-primary")
    .attr("font-size", "1.7rem")
    .attr("y", 10)
    .text(title);
};
