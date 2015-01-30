
var width = 960,
    height = 800;

var color = d3.scale.category20();

var force = d3.layout.force()
    .gravity(.05)
    .charge(-300)
    .distance(100)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("data.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var nodes = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  nodes.append("rect")
      .attr("class", "node")
      .attr("width", 100)
      .attr("height", 20)
      .style("fill", function(d) { return color(d.group); })

  nodes.append("title")
      .text(function(d) { return d.name; });

  nodes.append("text")
      // .attr("dx", 12)
      .attr("dy", "1em")
      .style("stroke", "none")
      .style("fill", "black")
      // .style("font-weight", "bold")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});