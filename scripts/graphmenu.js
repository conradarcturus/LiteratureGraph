
var graphbox = d3.select("#graphbox");

var graphmenu = graphbox.append("div")
	.attr("id", "graphmenu");


// Standard buttons
graphmenu.append("input")
	.attr("id", "button_refresh")
	.attr("type", "button")
	.attr("value", "Refresh Graph")
	.on("click", function() {
		bibTex2nodes(bibObject);
	});

graphmenu.append("input")
	.attr("id", "button_saveBibTex")
	.attr("type", "button")
	.attr("value", "Save BibTex")
	.on("click", makeBibTex);

// Add coloring options
coloroptions = graphmenu.append("div")
coloroption_list = ["Read", "Year", "NLP", "HCI", "UI"];

function addColorOption(OptionName) {
	optionname = OptionName.toLowerCase();
	coloroptions.append("input")
		.data([optionname])
		.attr("id", "button_color_" + optionname)
		.attr("type", "button")
		.attr("value", OptionName)
		.on("click", function(d) {
			console.log(d);
			coloroption = d;
			graph_restart();
		});
}


coloroptions.append("text")
	.text("Coloring Scheme:");
addColorOption("Read");
addColorOption("Year");

coloroptions.append("text")
	.html("<br \>");
addColorOption("HCI");
addColorOption("UI");
addColorOption("InfoSci");
addColorOption("NLP");
addColorOption("Values");

coloroptions.append("text")
	.html("<br \>");
addColorOption("SocPsych");
addColorOption("PoliSci");
addColorOption("Untagged");
