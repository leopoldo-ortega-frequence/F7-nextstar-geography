// data imports
import { incomeData, ageData, compData, deviceData, colors } from "./data.js";
// graphs imports
import { renderIncome } from "./graphs/income.js";
import { renderAge } from "./graphs/age.js";
import { renderGeo } from "./graphs/geo.js";
import { renderDevice } from "./graphs/device.js";
const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const WIDTH = 1000;
const HEIGHT = 640;
const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

// handle color tool here
const colorTool = document.querySelector("#color-tool");
const colorList = document.querySelector("#color-list");
// populate the list with the colors
const ul = document.createElement("ul");
colors.forEach((d, i) => {
  const li = document.createElement("li");
  li.classList.add("color-option");
  const button1 = document.createElement("button");
  button1.classList.add("color-box");
  button1.style.backgroundColor = d.primary;
  button1.value = i;
  const button2 = document.createElement("button");
  button2.classList.add("color-box");
  button2.style.backgroundColor = d.secondary;
  button2.value = i;
  li.appendChild(button1);
  li.appendChild(button2);
  ul.appendChild(li);
});
colorList.appendChild(ul);
colorTool.addEventListener("click", (e) => {
  colorList.classList.toggle("active");
});
colorList.addEventListener("click", (e) => {
  if (e.target.classList.contains("color-box")) {
    const newColors = colors[e.target.value];
    console.log(newColors);
    document.documentElement.style.setProperty(
      "--primary",
      `${newColors.primary}`
    );
    document.documentElement.style.setProperty(
      "--secondary",
      `${newColors.secondary}`
    );
  }
});

// global scales
const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

const svg = d3
  .select("#graph-container")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);
const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);
// create lines for the graph separation
g.append("line")
  .attr("class", "stroke-primary")
  .style("stroke-width", 2)
  .attr("x1", 0)
  .attr("y1", innerHeight / 2)
  .attr("x2", innerWidth)
  .attr("y2", innerHeight / 2);
// top vertical line
g.append("line")
  .attr("class", "stroke-primary")
  .style("stroke-width", 2)
  .attr("x1", innerWidth / 1.9)
  .attr("y1", 0)
  .attr("x2", innerWidth / 1.9)
  .attr("y2", innerHeight / 2);
// bottom vertical line
g.append("line")
  .attr("class", "stroke-primary")
  .style("stroke-width", 2)
  .attr("x1", innerWidth / 2.2)
  .attr("y1", innerHeight / 2)
  .attr("x2", innerWidth / 2.2)
  .attr("y2", innerHeight);

// g element for each graph
const incomeG = g
  .append("g")
  .attr("class", "income-graph-container")
  .attr("transform", `translate(40,10)`);
const ageG = g
  .append("g")
  .attr("class", "age-graph-container")
  .attr("transform", "translate(510,10)");
const geoG = g
  .append("g")
  .attr("class", "geo-graph-container")
  .attr("transform", `translate(10,320)`);
const deviceG = g
  .append("g")
  .attr("class", "device-graph-container")
  .attr("transform", `translate(460,320)`);

// call the graphs here
renderIncome(incomeG, {
  data: incomeData,
  width: 370,
  height: 200,
  title: "Income Range",
  xProp: "value",
  yProp: "name",
  colorScale: colorScale,
});
renderAge(ageG, {
  data: ageData,
  width: 350,
  height: 230,
  title: "Age Ranges",
  xProp: "name",
  yProp: "value",
  radius: 8,
  description: "Based on population averages of your target area",
});

renderGeo(geoG, {
  data: compData,
  width: 220,
  height: 220,
  title: "Geographic Composition",
  xProp: "name",
  yProp: "value",
  colorScale: colorScale,
});

renderDevice(deviceG, {
  data: deviceData,

  title: "Device Usage",
  xProp: "value",
  yProp: "name",
});
