export class DeviceDoughnut {
  constructor(_selector, _data, _width, _height) {
    this.selector = _selector;
    this.data = _data;
    this.width = _width;
    this.height = _height;

    this.init();
  }
  // initalizes the framework for the graph, all static elements go here
  init() {
    this.radius = Math.min(this.width, this.height) / 2.8;
    this.color = d3
      .scaleOrdinal()
      .range(["primary", "secondary", "tertiary", "quaternary"]);
    this.arc = d3
      .arc()
      .outerRadius(this.radius - 25) // chops offf outer circle
      .innerRadius(this.radius - 50); // chops off innrer circle, use this to convert pie chart to donut

    this.pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);

    this.selector
      .append("text")
      .text("Device Usage")
      .attr("y", 10)
      .attr("class", "fill-primary")
      .attr("font-size", "1.7rem");

    this.graphG = this.selector
      .append("g")
      .attr("transform", "translate(" + 100 + "," + this.height / 2 + ")");

    this.graphG
      .append("image")
      .attr(
        "xlink:href",
        "https://s3.amazonaws.com/brandcdn-assets/partners/frequence/proposal-v2/img/icon-devices.png"
      )
      .attr("x", -36)
      .attr("y", -30);

    this.legendG = this.graphG
      .append("g")
      .attr("transform", `translate(${110}, ${-60})`);

    // call data update
    this.updateData(this.data);
  }

  updateData(newData) {
    this.updateVis(newData);
    this.updateLegend(newData);
  }

  updateVis(newData) {
    const vis = this; // need this to avoid scoping issues when calling methods

    this.t = d3.transition().duration(750);

    this.path = this.graphG.selectAll("path").data(this.pie(newData));

    this.path.transition(this.t).attrTween("d", arcTween);
    this.path
      .enter()
      .append("path")
      .attr("class", (d) => `fill-${this.color(d.data.name)}`)
      .transition(this.t)
      .attrTween("d", arcTween);
    function arcTween(d) {
      const i = d3.interpolate(this._current, d);
      this._current = i(1);
      return (t) => vis.arc(i(t));
    }
  }

  updateLegend(newData) {
    // set the data here
    this.legendRow = this.legendG
      .selectAll(".legend-data")
      .data(newData, (d) => d.name);

    // // this enters() the data, therefore it is the parent container for where changes need to take place
    this.enterLegend = this.legendRow
      .enter()
      .append("g")
      .attr("class", "legend-data")
      .attr("transform", (d, i) => {
        return `translate(0, ${i * 45})`;
      })
      .merge(this.legendRow);

    this.enterRect = this.enterLegend
      .append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("class", (d) => `legend-data fill-${this.color(d.name)}`);

    this.enterText = this.enterLegend
      .append("text")
      .attr("class", "legend-data")
      .attr("x", 40)
      .attr("y", 20)
      .attr("text-anchor", "start")
      .text((d) => {
        return `${d.value}% ${d.name}`;
      });

    this.exitText = this.legendRow.exit().remove();
  }
}
