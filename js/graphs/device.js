export const renderDevice = (selector, props) => {
  // props --> do this to make graph more modular
  const { data, title, xProp, yProp } = props;
  const graphG = selector.append("g").attr("transform", "translate(0,60)");
  const gEnter = graphG
    .selectAll(".device-data")
    .data(data)
    .enter()
    .append("g");

  gEnter
    .append("text")
    .attr("class", "fill-primary")
    .style("text-transform", "uppercase")
    .attr("font-size", "12px")
    .attr("y", (d, i) => i * 75)
    .text((d) => d[yProp]);

  gEnter
    .append("image")
    .attr("xlink:href", (d) => `./assets/${d[yProp]}.svg`)
    .attr("x", function (d) {
      return (81 - this.getBBox().width) / 2;
    })
    .attr("y", (d, i) => i * 75 + 10)
    .attr("height", 50);

  // no loop approach to appending circles
  gEnter
    .append("g")
    .selectAll("rect")
    .data((d, i) => d3.range(Math.ceil(d[xProp]) / 3).map((d) => i))
    .enter()
    .append("rect")
    .attr("class", "fill-primary")
    .attr("width", 6)
    .attr("height", 30)
    .attr("x", (d, i) => i * 6 * 1.8 + 100)
    .attr("y", (d) => d * 80 + 18);
  selector
    .append("text")
    .attr("class", "title fill-primary")
    .attr("font-size", "1.7rem")
    .attr("y", 10)
    .text(title);
};