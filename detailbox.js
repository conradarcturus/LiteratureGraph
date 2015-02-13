/**
 * detailbox.js
 * 
 * Maintains the box containing details of the graph
 */

var detailbox = d3.select("#detailbox");

// Standard buttons
detailbox.append("input")
	.attr("id", "button_refresh")
	.attr("type", "button")
	.attr("value", "Refresh Graph")
	.on("click", function() {
		bibTex2nodes(bibObject);
	});

detailbox.append("input")
	.attr("id", "button_saveBibTex")
	.attr("type", "button")
	.attr("value", "Save BibTex")
	.on("click", makeBibTex);

// Box for uploading files
uploadbox = detailbox.append("div")
	.attr("class", "featurebox");

uploadbox.append("text")
	.text("Upload .bib")
	.attr("class", "featuretitle");

uploadbox.append("input")
	.attr("id", "button_loadBibTex")
	.attr("type", "file")
	.attr("class", "featureinput")
	.on("change", function() {
		file = this.files[0];
		if (file) {
			if(file.name.indexOf(".bib") == -1) {
			    alert("Please upload a .bib file.");
			    return;
			}

			var reader = new FileReader();
			reader.onload = function(e) { 
				addBibTex(e.target.result);
			}
			reader.readAsText(file);
		} else { 
			alert("Failed to load file");
		}
	});

// Manual Entry for Node
var bibtexinputbox;
featurebox = detailbox.append("div")
	.attr("class", "commentbox");

featurebox.append("div")
	.text("Manual Node")
	.attr("class", "featuretitle");

featurebox.append("input")
	.attr("type", "button")
	.attr("value", "Import BibTex Citation")
	.attr("class", "featureinput")
	.on("click", function(d) {
		// console.log(bibtexinputbox[0][0].value);
		addBibTex(bibtexinputbox[0][0].value);
		bibtexinputbox[0][0].value = "";
    });

bibtexinputbox = featurebox.append("textarea")
	.attr("class", "commentarea")
	.attr("value", "");