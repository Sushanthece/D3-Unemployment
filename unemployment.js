var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

var x = d3.time.scale()
    .rangeRound([0, width]);

var y = d3.scale.linear()
    .domain([0, .2])
    .rangeRound([height, 0]);

var z = d3.scale.linear()
    .domain([0, 30])
    .range(["#cccccc", "purple"])
    .interpolate(d3.interpolateLab);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("%"));

var svg = d3.select("#main_content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("unemployment.json", function(error, data) {
  var parseDate = d3.time.format("%Y-%m").parse;

  x.domain(d3.extent(data, function(d) { return d.key = parseDate(d.key); }));

  var date = svg.selectAll(".date")
      .data(data)
    .enter().append("g")
      .attr("class", "date")
      .attr("transform", function(d) { return "translate(" + x(d.key) + ",0)"; });

  date.selectAll(".bin")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .attr("class", "bin")
      .attr("y", function(d) { return y(d.x + d.dx); })
      .attr("height", function(d) { return y(d.x) - y(d.x + d.dx); })
      .style("fill", function(d) { return z(d.y); });

  date.each(function(d) {
    d3.select(this).selectAll(".bin")
        .attr("width", x(d3.time.month.offset(d.key, 1)) - x(d.key));
  });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
});
