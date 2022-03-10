import { deviceSVG } from "./deviceImages.js";

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
    .append("g")
    .attr("class", "icons-container")
    .attr("transform", (d, i) => {
      return `translate(${0},${i * 75 + 10}) scale(0.7)`;
    })
    .html((d) => deviceSVG[d[yProp]]);

  // no loop approach to appending circles
  const rectEnter = gEnter
    .append("g")
    .attr("class", "rect-col-container")
    .selectAll(".rect-col")
    .data((d, i) => d3.range(Math.ceil(d[xProp]) / 3).map((d) => i))
    .enter();
  rectEnter
    .append("rect")
    .attr("class", "fill-primary")
    .attr("width", 6)
    .attr("height", 30)
    .attr("x", (d, i) => i * 6 * 1.8 + 100)
    .attr("y", (d) => d * 80 + 18);

  gEnter
    .append("text")
    .attr("class", "fill-primary")
    .attr("y", (d, i) => i * 75 + 40)
    .attr("x", (d) => {
      return Math.ceil(d.value / 3) * 11 + 100;
    })
    .text((d) => `${d.value}%`);

  selector
    .append("text")
    .attr("class", "title fill-primary")
    .attr("font-size", "1.7rem")
    .attr("y", 10)
    .text(title);
};
