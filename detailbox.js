/**
 * detailbox.js
 * 
 * Maintains the box containing details of the graph
 */

var detailbox = d3.select("#detailbox");



// Add button to "save" the data
detailbox.append("input")
	.attr("name", "button_loadBibTex")
	.attr("type", "button")
	.attr("value", "Refresh Graph")
	.on("click", function() {
		bibTex2nodes(bibObject);
	});

detailbox.append("input")
	.attr("name", "button_loadBibTex")
	.attr("type", "button")
	.attr("value", "Load BibTex")
	.on("click", function() {
		loadBibFile("hcdereview.bib")
	});

detailbox.append("input")
	.attr("name", "button_makeBibTex")
	.attr("type", "button")
	.attr("value", "Make BibTex")
	.on("click", makeBibTex);
