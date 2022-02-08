export const renderGeo = (selector, props) => {
  // props --> do this to make graph more modular
  const { data, width, height, title, xProp, yProp } = props;
  // sort the data from largest to smallest
  const compare = (a, b) => {
    if (a[yProp] < b[yProp]) {
      return 1;
    }
    if (a[yProp] > b[yProp]) {
      return -1;
    }
    return 0;
  };

  data.sort(compare);

  //scales
  const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]).nice();
  const yScale = d3.scaleLinear().domain([0, 100]).range([0, height]).nice();
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
  const size = d3
    .scaleSqrt()
    .domain([1, 50]) // What's in the data, let's say it is percentage
    .range([1, width / 3]); // Size in pixel
  const xAxis = d3.axisBottom(xScale).ticks(4).tickSize(-width).tickPadding(15);

  const yAxis = d3.axisLeft(yScale).ticks(4).tickSize(-height).tickPadding(10);
  const graphG = selector.append("g").attr("transform", "translate(0,40)");
  const legendG = selector.append("g").attr("transform", "translate(250,50)");
  const yAxisG = graphG.append("g").attr("class", "graph-primary").call(yAxis);
  const xAxisG = graphG
    .append("g")
    .attr("class", "graph-primary")
    .call(xAxis)
    .attr("transform", `translate(0,${height})`);

  // draw line axis
  graphG
    .append("line")
    .attr("class", "stroke-primary")
    .style("stroke-width", 1)
    .attr("x1", -20)
    .attr("y1", height + 20)
    .attr("x2", width)
    .attr("y2", height + 20);
  graphG
    .append("line")
    .attr("class", "stroke-primary")
    .style("stroke-width", 1)
    .attr("x1", -20)
    .attr("y1", height + 20)
    .attr("x2", -20)
    .attr("y2", 0);
  // draw arrows
  graphG
    .append("polygon")
    .attr("points", `-25,0 -20,-10 -15,0`)
    .attr("class", "fill-primary");
  graphG
    .append("polygon")
    .attr(
      "points",
      `${width},${height + 15} ${width},${height + 25} ${width + 10},${
        height + 20
      }`
    )
    .attr("class", "fill-primary");

  graphG
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", width / 2)
    .attr("fill", "none")
    .attr("class", "stroke-dark")
    .attr("stroke-dasharray", "4")
    .attr("stroke-width", 2);

  graphG
    .append("g")
    .attr("transform", "rotate(45) translate(50,-110)")
    .selectAll(".circle-data")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", width / 2)
    //.attr("cx", (d) => size(d[yProp]) + 30)
    .attr("cy", (d) => height - size(d[yProp]))
    .attr("r", (d) => size(d[yProp]))
    .attr("fill", (d, i) => colorScale(i));

  // legend that displays data
  const legendEnter = legendG
    .selectAll(".legend-data")
    .data(data)
    .enter()
    .append("g");
  legendEnter
    .append("text")
    .attr("font-size", "14px")
    .attr("fill", (d, i) => colorScale(i))
    .attr("y", (d, i) => i * 50)
    .text((d) => d[yProp] + "%");
  legendEnter
    .append("text")
    .attr("font-size", "14px")
    .attr("fill", (d, i) => colorScale(i))
    .attr("y", (d, i) => i * 50 + 15)
    .text((d) => d[xProp]);
  selector
    .append("text")
    .attr("class", "title fill-primary")
    .attr("font-size", "1.7rem")
    .attr("y", 10)
    .text(title);
};
