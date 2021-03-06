// Setup force network

var width = 1000,
    height = 800;

var color = d3.scale.category20();

var force = d3.layout.force()
  .gravity(.05)
  .charge(-300) // -300
  // .chargeDistance(200)
  .distance(100)
  .theta(0.8)
  .size([width, height])
  .on("tick", tick);

var graphbox = d3.select("#graphbox");

var svg = graphbox.append("svg")
  .attr("width", width)
  .attr("height", height);
  // .on("mousemove", mousemove)
  // .on("mousedown", addNode);

var nodes = force.nodes(),
  links = force.links(),
  node = svg.selectAll(".node"),
  link = svg.selectAll(".link");

var citation2node = {},
  citations_cites = {},
  citations_citedby = {},
  citationpair2edge = {};

graph_restart();

// Add Interactions


function mousemove() {
  // nothing
}

var nextNodeID = 0;
// function addNode() {
//   var point = d3.mouse(this),
//       node = {x: point[0], y: point[1], group:1, name: "Node" + nextNodeID, order:nextNodeID},
//       n = nodes.push(node);
//     nextNodeID++;

//   // add links to any nearby nodes
//   nodes.forEach(function(target) {
//     var x = target.x - node.x,
//         y = target.y - node.y;
//     if (Math.sqrt(x * x + y * y) < 30) {
//       links.push({source: node, target: target});
//     }
//   });

//   graph_restart();
// }

function tick() {
  d3.selectAll(".linkgroup")
    .attr("transform", function(d) {
      var dx = d.target.x - d.source.x, 
          dy = d.target.y - d.source.y, 
          da = Math.atan2(dy, dx) * 180 / Math.PI; 
          dr = Math.sqrt(dx * dx + dy * dy);
      return "translate(" + d.source.x + "," + d.source.y + ") " +
             "rotate(" + da + ")" +
             "scale(" + dr + ",1) " ;
             // "scale(" + dx + "," + dy + ") " ;
    });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function graph_restart() {
  link = link.data(links);

  svggs = link.enter().insert("svg:g", ".node")
      .attr("class", "linkgroup");

  svggs.insert("line")
      .attr({x1: 0, y1: 0, x2: 1, y2: 0})
      .attr("class", function(d) {
        classes = ["link",
          "cited_" + d.source.citekey,
          "citer_" + d.target.citekey]
        return classes.join(" ");
      });

  svggs.append("polygon")
    .attr("class", "arrowhead")
    .attr("points", "1,0 .9,-5 .9,5");

  node = node.data(nodes);

  freshnode = node.enter().append("g")
    .attr("class", "node")
    .on("mousedown", function(d) {
      d3.event.stopPropagation();
      selectNode(d);
      if (d3.event.shiftKey) 
        return; // try to ignore drag, but this doesn't work
      })
    .call(force.drag);
    
  freshnode.append("text");
    // .style("fill", function(d) { return color(d.group); })
    // .text(function(d) { return d.name; });

  force.start();

  // Refresh text if necessary
  node.selectAll(".node text")
    .style("fill", function(d) {
      switch(d.group) {
        case "2": return "#171";
        case "1": return "#177";
        default: return "#117";
      }
      // return color(d.group);
    })
    .text(function(d) { return d.name; });
}

function addNode (citekey, citation) {
  var newNode = findNodeByCiteKey(citekey)
  var nodeIsNew = !newNode;

  // If we have a new node, make new features
  if(newNode == null) {
    newNode = {};
    newNode.x = width / 2;
    newNode.y = height / 2;
  }

  if("read" in citation)
    newNode.group = citation.read;
  else
    newNode.group = '0';

  if("author" in citation)
    if("year" in citation)
      newNode.name = citation.author.split(/[\s,]+/)[0] + " " + citation.year;
    else
      newNode.name = citation.author.split(/[\s,]+/)[0];
  else
    newNode.name = "No author";
  newNode.citation = citation;
  newNode.citekey = citekey;
  newNode.order = -1; // placeholder until I'm certain it is no longer necessary

  if (nodeIsNew) {
    // Add to list of nodes
    n = nodes.push(newNode);

    // Add key in nodes list to citation2node map
    citation2node[citekey] = nodes.length - 1;
  } else
    nodes[newNode.index] = newNode;
}


function connectNode (citekey, citation) {
  citer = citekey;
  node_citer = findNodeByCiteKey(citekey);

  if("citations" in citation) {
    cited_papers = citation.citations;
    for(var citedkey in cited_papers) {
      cited = cited_papers[citedkey];

      existingEdge = findEdgeByCiteKeys(citer, cited);
      if(!existingEdge) {

        var node_cited = findNodeByCiteKey(cited);
        if(!node_cited || !node_citer)
          continue;
        links.push({source: node_cited, target: node_citer, value: 1});

        citationpair2edge[citer + "->" + cited] = links.length - 1;
        addNeighbor(citer, cited);
      }
    }
  }
}


function bibTex2nodes (bibObject) {

  // All the nodes to the nodes object
  for (var citekey in bibObject) {
    addNode(citekey, bibObject[citekey]);
  }

  // Connect the nodes
  for (var citekey in bibObject) {
    connectNode(citekey, bibObject[citekey]);
  }

  graph_restart();
}

function findNodeByCiteKey (citekey) {
  if(citekey in citation2node)
    return nodes[citation2node[citekey]];
  else
    return null;
}

function findEdgeByCiteKeys (citer, cited) {
  key = citer + "->" + cited;
  if(key in citationpair2edge)
    return links[citationpair2edge[key]];

  return null;
}

function addNeighbor (citer, cited) {
  // citer cites cited
  adjlist = citations_cites[citer];

  if(!adjlist)
    adjlist = {};

  if(!(cited in adjlist)) {
    adjlist[cited] = 1;
  }

  citations_cites[citer] = adjlist;

  // cited cited by citer
  adjlist = citations_citedby[cited];

  if(!adjlist)
    adjlist = {};

  if(!(citer in adjlist)) {
    adjlist[citer] = 1;
  }

  citations_citedby[cited] = adjlist;
}


