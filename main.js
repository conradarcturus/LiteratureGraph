// Setup force network

var width = 960,
    height = 800;

var color = d3.scale.category20();

var force = d3.layout.force()
    .gravity(.05)
    .charge(-300)
    .distance(100)
    .size([width, height])
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousemove", mousemove)
    .on("mousedown", addNode);


var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

restart();

// Add Interactions


function editNode() {
  console.log("EditNode");
}

function mousemove() {
  // nothing
}

nextNodeID = 1;
function addNode() {
  var point = d3.mouse(this),
      node = {x: point[0], y: point[1], group:1, name: "Node" + nextNodeID},
      n = nodes.push(node);
    nextNodeID++;

  // add links to any nearby nodes
  nodes.forEach(function(target) {
    var x = target.x - node.x,
        y = target.y - node.y;
    if (Math.sqrt(x * x + y * y) < 30) {
      links.push({source: node, target: target});
    }
  });

  restart();
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function restart() {
  link = link.data(links);

  link.enter().insert("line", ".node")
      .attr("class", "link");
      // .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  node = node.data(nodes);

  node.enter().append("g")
      .attr("class", "node")
      .on("dblclick", function(d) {
          editNode();
        })
      .on("mousedown", function(d) {
        d3.event.stopPropagation();
        if (d3.event.shiftKey) 
          return; // ignore drag, doesn't work
        })
      .call(force.drag);

  node.append("rect")
      .attr("class", "node")
      .attr("width", 100)
      .attr("height", 20)
      .style("fill", function(d) { return color(d.group); });

  node.append("text")
      .attr("dy", "1em")
      .style("stroke", "none")
      .style("fill", "black")
      .text(function(d) { return d.name; });

  force.start();
}


// Populate Force Network
var graphe;

d3.json("data.json", function(error, graph) {
  // Add each node from the graph into the view
  graph.nodes.forEach(function(nodeinfo) {
    var node = {x: width/2, y: height/2, group:nodeinfo.group, name:nodeinfo.name},
        n = nodes.push(node);
  })

  // Connect the nodes


  graphe = graph;

  restart();


  // // add links to any nearby nodes
  // nodes.forEach(function(target) {
  //   var x = target.x - node.x,
  //       y = target.y - node.y;
  //   if (Math.sqrt(x * x + y * y) < 30) {
  //     links.push({source: node, target: target});
  //   }




  // var link = svg.selectAll(".link")
  //     .data(graph.links)
  //   .enter().append("line")
  //     .attr("class", "link")
  //     .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  // var nodes = svg.selectAll(".node")
  //     .data(graph.nodes)
  //   .enter().append("g")
  //     .attr("class", "node")
  //     .call(force.drag);

  // nodes.append("rect")
  //     .attr("class", "node")
  //     .attr("width", 100)
  //     .attr("height", 20)
  //     .style("fill", function(d) { return color(d.group); })

});