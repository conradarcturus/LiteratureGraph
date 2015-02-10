// Setup force network

var width = 960,
    height = 800;

var color = d3.scale.category20();

var force = d3.layout.force()
  .gravity(.05)
  .charge(-300)
  .distance(100)
  .theta(0.8)
  .size([width, height])
  .on("tick", tick);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .on("mousemove", mousemove)
  .on("mousedown", addNode);

var toolbar = d3.select("body").append("div")
  .attr("id", "toolbar")
  .attr("width", 200)
  .attr("height", 400);


var nodes = force.nodes(),
  links = force.links(),
  node = svg.selectAll(".node"),
  link = svg.selectAll(".link");

restart();

// Add Interactions


function editNode(node, d) {
  var p = node.parentNode;
  var node_d3 = d3.select(node);
  console.log(d.order);
  console.log("editNode", node);

  // inject a HTML form to edit the content here...
  var xy = node.getBBox();
  var p_xy = p.getBBox();

  xy.x -= p_xy.x;
  xy.y -= p_xy.y;

  var displayText = node_d3.select("text");
  var field = "name";

  var frm = node_d3.append("foreignObject")
    .attr("transform", "translate(-50, 0)")
    .attr("id", "editbox");

  var inp = frm
    .attr("width", xy.width)
    .attr("height", xy.height)
    .append("xhtml:form")
      .append("input")
        .attr("value", function() {
          // nasty spot to place this call, but here we are sure that the <input> tag is available
          // and is handily pointed at by 'this':
          node.focus();

          return d[field];
        })
        .attr("style", "width: 294px;")
        .style("background-color", color(d.group))
        .on("mousedown", function(d) {
          d3.event.stopPropagation();
        })
        .on("dblclick", function(d) {
          d3.event.stopPropagation();
        })
        // make the form go away when you jump out (form looses focus) or hit ENTER:
        .on("blur", function() {
          console.log("blur", node);

          var txt = inp.node().value;

          displayText.text(txt);
          nodes[d.order][field] = txt;

          // Note to self: frm.remove() will remove the entire <g> group! Remember the D3 selection logic!
          try {
            node_d3.select("#editbox").remove();
          } catch (e) {
            // do nothing, super bad but this was throwing strange errors.
          }
        })
        .on("keypress", function() {
          console.log("keypress", node, d3.event.keyCode);

          // IE fix
          if (!d3.event)
              d3.event = window.event;

          var e = d3.event;
          if (e.keyCode == 13)
          {
            if (typeof(e.cancelBubble) !== 'undefined') // IE
              e.cancelBubble = true;
            if (e.stopPropagation)
              e.stopPropagation();
            e.preventDefault();

            var txt = inp.node().value;

            d[field] = txt;
            displayText.text(txt);
            nodes[d.order][field] = txt;

            // odd. Should work in Safari, but the debugger crashes on this instead.
            // Anyway, it SHOULD be here and it doesn't hurt otherwise.
            try{
              node_d3.select("#editbox").remove();
            } catch (e) {
            // do nothing, super bad but this was throwing strange errors.
            }
          }
        });
}

function mousemove() {
  // nothing
}

var nextNodeID = 0;
function addNode() {
  var point = d3.mouse(this),
      node = {x: point[0], y: point[1], group:1, name: "Node" + nextNodeID, order:nextNodeID},
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

  freshnode = node.enter().append("g")
    .attr("class", "node")
    .on("dblclick", function(d) {
        editNode(this, d);
      })
    .on("mousedown", function(d) {
      d3.event.stopPropagation();
      if (d3.event.shiftKey) 
        return; // ignore drag, doesn't work
      })
    .call(force.drag);
    
  freshnode.append("text")
    .style("fill", function(d) { return color(d.group); })
    .text(function(d) { return d.name; });

  force.start();
}


// Import Data

d3.json("data.json", function(error, graph) {
  // Add each node from the graph into the view

  graph.nodes.forEach(function(nodeinfo) {
    var node = {x: width/2, y: height/2, group:nodeinfo.group, name:nodeinfo.name, order:nextNodeID},
        n = nodes.push(node);
    nextNodeID++;
  })

  // Connect the nodes
  graph.links.forEach(function(linkinfo) {
    // console.log(linkinfo.source, linkinfo.target, nodes);
    node_source = nodes[linkinfo.source];
    node_target = nodes[linkinfo.target];
    links.push({source: node_source, target: node_target, value: linkinfo.value});
  })

  restart();
});


// Save Data
function saveData() {

  var fancylinks = [];
  for(i = 0; i < links.length; i++) {
    fancylink = {};
    fancylink.source = links[i].source.index;
    fancylink.target = links[i].target.index;
    fancylink.value = links[i].value;
    fancylinks.push(fancylink);
  }

  // Save Data
  var data = "{\"nodes\":" + JSON.stringify(nodes, ["name", "group", "index"], "\t") + ",\"links\":" + JSON.stringify(fancylinks, null, "\t") + "}";
  var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
  window.open(url, '_blank');
  window.focus();
}