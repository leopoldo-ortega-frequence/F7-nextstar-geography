// data imports
import { incomeData, ageData, compData, deviceData, colors } from "./data.js";
// graphs imports
import { renderIncome } from "./graphs/income.js";
import { renderAge } from "./graphs/age.js";
import { renderGeo } from "./graphs/geo.js";
import { renderDevice } from "./graphs/device.js";
import { DeviceDoughnut } from "./graphs/deviceCircle.js";
import { treeMapChart } from "./graphs/ageTreeMap.js";
import { spiderChart } from "./graphs/spiderChart.js";
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
// create custom color picker
const li = document.createElement("li");
const option1 = document.createElement("input");
option1.type = "color";
option1.classList.add("primary-picker");
const option2 = document.createElement("input");
option2.type = "color";
option2.classList.add("secondary-picker");
li.appendChild(option1);
li.appendChild(option2);
ul.appendChild(li);
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

document.querySelector(".primary-picker").addEventListener("input", (e) => {
  const color = e.target.value;
  document.documentElement.style.setProperty("--primary", `${color}`);
});
document.querySelector(".secondary-picker").addEventListener("input", (e) => {
  const color = e.target.value;
  document.documentElement.style.setProperty("--secondary", `${color}`);
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

// event listeners for buttons

$("#device-btn").click(function (e) {
  deviceG.html("");
  $(this).toggleClass("active");
  if ($(this)[0].className.includes("active")) {
    // rednder circle chart
    const deviceDoughnut = new DeviceDoughnut(deviceG, deviceData, 400, 300);
  } else {
    // render current graph
    renderDevice(deviceG, {
      data: deviceData,
      title: "Device Usage",
      xProp: "value",
      yProp: "name",
    });
  }
});

$("#age-btn").click(function (e) {
  ageG.html("");
  $(this).toggleClass("active");
  if ($(this)[0].className.includes("active")) {
    ageData.forEach((d) => {
      d.group = "Age";
    });
    // rednder circle chart
    treeMapChart(ageG, {
      data: ageData,
      graphWidth: 390,
      graphHeight: 200,
      width: 760,
      title: "Age Ranges",
      interestCategories: ["demographic", "Industry", "Interests", "Multiple"],
    });
  } else {
    // render current graph
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
  }
});

$("#income-btn").click(function (e) {
  incomeG.html("");
  $(this).toggleClass("active");
  if ($(this)[0].className.includes("active")) {
    console.log("render spider chart");
  } else {
    // render current graph
    renderIncome(incomeG, {
      data: incomeData,
      width: 370,
      height: 200,
      title: "Income Range",
      xProp: "value",
      yProp: "name",
      colorScale: colorScale,
    });
  }
});

// Config for the Radar chart
// var config = {
//   w: 300,
//   h: 300,
//   maxValue: 100,
//   levels: 4,
//   ExtraWidthX: 300,
// };

// //Call function to draw the Radar chart

// RadarChart.draw(
//   incomeG,
//   [
//    incomeData
//   ],
//   config
// );
