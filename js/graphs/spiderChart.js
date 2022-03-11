export const spiderChart = () => {
  var target = d3.select("#container");

  var div = target.node().getBoundingClientRect();
  var padding = { top: 30, right: 30, bottom: 30, left: 30 };
  var width = div.width - padding.left - padding.right;
  var height = div.height - padding.top - padding.bottom;
  var colors = d3.schemeCategory10;

  var svg = target
    .append("svg")
    .attr("width", div.width)
    .attr("height", div.height);
  var main = svg
    .append("g")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

  var options = {
    gridCount: 4,
    gridStyle: "polygon", // circle, polygon
  };
  var axis = [
    { name: "A", dataKey: "data1" },
    { name: "B", dataKey: "data2" },
    { name: "C", dataKey: "data3" },
    { name: "D", dataKey: "data4" },
    { name: "E", dataKey: "data5" },
    { name: "F", dataKey: "data6" },
  ];
  var data = [
    { name: "DATA-1", data1: 40, data2: 50, data3: 45, data5: 100, data6: 70 },
    { name: "DATA-2", data1: 60, data3: 70, data4: 30, data5: 80 },
    { name: "DATA-3", data1: 30, data3: 80, data4: 30, data5: 100 },
  ];
  var max = 100;
  var Format = d3.format(".0%");
  var radian = (Math.PI * 2) / axis.length;
  var radius = (Math.min(width, height) / 2) * 0.8;
  var center = { x: width / 2, y: height / 2 };
  var c = d3.scaleOrdinal().range(colors);
  var s = d3.scaleLinear().domain([0, max]).range([0, radius]);

  var axisAngles = d3.map();
  axis.forEach(function (d, i) {
    axisAngles.set(d.dataKey, i * radian);
  });
  var names = [];
  data.forEach(function (d, i) {
    names.indexOf(d.name) < 0 && names.push(d.name);
  });
  c.domain(names);

  var axisgrid = main
    .append("g")
    .attr("class", "axis-grid")
    .attr("transform", "translate(" + center.x + ", " + center.y + ")");

  var gridData = d3
    .range(1, options.gridCount + 1)
    .reverse()
    .map(function (d) {
      var r = (radius / options.gridCount) * d;
      var path = axis.map(function (a, i) {
        var x = r * Math.sin(i * radian);
        var y = r * -Math.cos(i * radian);
        return x + "," + y;
      });
      return {
        radius: r,
        points: path,
      };
    });

  // circle grid
  if (options.gridStyle === "circle") {
    axisgrid
      .selectAll("circle.grid")
      .data(gridData)
      .enter()
      .append("circle")
      .attr("class", "grid")
      .attr("r", function (d) {
        return d.radius;
      })
      .style("fill", "#ffffff");
    //.style("stroke", "#c4c4c4")
  }
  // polygon grid
  if (options.gridStyle === "polygon") {
    axisgrid
      .selectAll("polygon.grid")
      .data(gridData)
      .enter()
      .append("polygon")
      .attr("class", "grid")
      .attr("points", function (d) {
        return d.points.join(" ");
      })
      .style("fill", "#ffffff");
    //.style("stroke", "#c4c4c4")
  }

  // grid-label
  axisgrid
    .selectAll("text.grid-label")
    .data(gridData)
    .enter()
    .append("text")
    .attr("class", "grid-label")
    .attr("y", function (d) {
      return -d.radius;
    })
    .attr("dx", "0.3em")
    .attr("dy", "1.3em")
    .style("font-size", "0.6em")
    .style("text-anchor", "start")
    .text(function (d, i) {
      return Format(s.invert(d.radius) / 100);
    });

  // axis
  axisgrid
    .selectAll("path.axis")
    .data(axis)
    .enter()
    .append("path")
    .attr("class", "axis")
    .attr("d", function (d, i) {
      var x = radius * Math.sin(i * radian);
      var y = radius * -Math.cos(i * radian);
      return "M 0,0" + " L" + x + "," + y;
    });
  //.style("stroke", "#c4c4c4")

  // axis-label
  axisgrid
    .selectAll("text.axis-label")
    .data(axis)
    .enter()
    .append("text")
    .attr("class", "axis-label")
    .attr("x", function (d, i) {
      return radius * 1.1 * Math.sin(i * radian);
    })
    .attr("y", function (d, i) {
      return radius * 1.1 * -Math.cos(i * radian);
    })
    .attr("dy", "0.3em")
    .style("text-anchor", function (d, i) {
      var angle = Math.round(i * radian * 100);
      if (angle == 0 || angle == Math.round(Math.PI * 100)) {
        return "middle";
      } else {
        return angle / 100 < Math.PI ? "start" : "end";
      }
    })
    .text(function (d, i) {
      return d.name;
    });

  var shapes = main
    .append("g")
    .attr("class", "shapes")
    .attr("transform", "translate(" + center.x + ", " + center.y + ")");

  shapes
    .selectAll("polygon.shape")
    .data(data)
    .enter()
    .append("polygon")
    .attr("class", "shape")
    .attr("points", function (d) {
      var p = [];
      d3.keys(d).forEach(function (key) {
        if (axisAngles.has(key)) {
          var v = s(d[key]);
          var a = axisAngles.get(key);
          p.push(v * Math.sin(a) + "," + v * -Math.cos(a));
        }
      });
      return p.join(" ");
    })
    .style("fill", function (d, i) {
      return c(d.name);
    })
    .style("fill-opacity", "0.3")
    .style("stroke", function (d, i) {
      return c(d.name);
    })
    .on("mouseover", function (d, i) {
      d3.select(this)
        .raise() // move to front - the last child of its parent
        .style("fill-opacity", "0.9");
    })
    .on("mouseout", function (d, i) {
      d3.select(this).style("fill-opacity", "0.3");
    });

  // legend
  var legend = d3.select("#legend");
  legend
    .selectAll("div.legend-item")
    .data(names)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .style("color", function (d, i) {
      return c(d);
    })
    .each(function (d, i) {
      var o = d3.select(this);
      var color = c(d);
      o.append("div")
        .style("border-color", color)
        .style("background-color", color)
        .attr("class", "point");

      o.append("div").attr("class", "text").text(d);
    });
};
