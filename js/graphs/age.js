export const renderAge = (selector, props) => {
  // props --> do this to make graph more modular
  const { data, width, height, title, xProp, yProp, radius, description } =
    props;

  const graphG = selector.append("g").attr("transform", "translate(0,0)");
  graphG
    .append("line")
    .attr("class", "stroke-primary")
    .style("stroke-width", 2)
    .attr("x1", 0)
    .attr("y1", height)
    .attr("x2", width)
    .attr("y2", height);

  const graphEnter = graphG
    .selectAll(".age-date")
    .data(data)
    .enter()
    .append("g");
  graphEnter
    .append("text")
    .attr("x", (d, i) => i * 55)
    .attr("y", `${height + 18}`)
    .attr("class", "fill-primary")
    .attr("font-size", "12px")
    .text((d) => d[xProp]);
  // no loop approach to appending circles
  graphEnter
    .append("g")
    .selectAll("circle")
    .data((d, i) => d3.range(d[yProp]).map((d) => i))
    .enter()
    .append("circle")
    .attr("class", "fill-dark")
    .attr("r", radius)
    .attr("cy", (d, i) => height - i * radius * 2 - 10)
    .attr("cx", (d) => d * 53 + 20);

  selector
    .append("text")
    .attr("class", "title fill-primary")
    .attr("font-size", "1.7rem")
    .attr("y", 10)
    .text(title);
  selector
    .append("foreignObject")
    .attr("y", height - 90)
    .attr("x", width + 20)
    .attr("width", 70)
    .attr("height", 100)
    .append("xhtml:div")
    .attr("class", "svg-text")
    .html(description);
};
