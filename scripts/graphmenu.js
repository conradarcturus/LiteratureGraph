
var graphbox = d3.select("#graphbox");

var graphmenu = graphbox.append("div")
	.attr("id", "graphmenu");


// Standard buttons
graphmenu.append("input")
	.attr("id", "button_refresh")
	.attr("type", "button")
	.attr("value", "Refresh Graph")
	.on("click", function() {
		bibTex2nodes(bibliography);
	});

graphmenu.append("input")
	.attr("id", "button_saveBibliography")
	.attr("type", "button")
	.attr("value", "Save")
	.on("click", storeBibliography);

graphmenu.append("input")
	.attr("id", "button_exportBibliography")
	.attr("type", "button")
	.attr("value", "Export")
	.on("click", exportBibliography);

// Add View Options
viewoptions = graphmenu.append("div");
viewoptions.append("input")
	.attr("id", "button_view_year")
	.attr("type", "button")
	.attr("value", "Toggle View Year")
	.on("click", function(){ viewToggle("year"); });

// Add coloring options
coloroptions = graphmenu.append("div");

function addColorOption(OptionName, type) {
	optionname = OptionName.toLowerCase();
	typeoptionname = type.length > 0 ? type + "_" + optionname : optionname;
	coloroptions.append("input")
		.data([typeoptionname])
		.attr("id", "button_color_" + typeoptionname)
		.attr("type", "button")
		.attr("value", OptionName)
		.on("click", function(d) {
			coloroption = d;
			graph_restart();
		});
}

coloroptions.append("text")
	.text("Coloring Scheme:");
addColorOption("All Black", "");
addColorOption("Read", "");
addColorOption("Year", "");

// coloroptions.append("text").html("<br \>");
// fields = ["HCI", "InfoSci", "NLP", "SocPsych", "PoliSci"," "];
// for (key in fields)
// 	addColorOption(fields[key], "field");

// coloroptions.append("text").html("<br \>");
// fields = ["Social", "Consume", "Delib", "UI", "Values", "LWIC", " "];
// for (key in fields)
// 	addColorOption(fields[key], "topics");
