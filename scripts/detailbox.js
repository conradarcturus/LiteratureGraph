/**
 * detailbox.js
 * 
 * Maintains the box containing details of the graph
 */

var detailbox = d3.select("#detailbox");

// Header
detailbox.append("div")
	.html("Literature Graph")
	.attr("class", "title");

detailbox.append("div")
	.html("Conrad Nied")
	.attr("class", "subtitle");

// Keyword search
searchbox = detailbox.append("div")
	.attr("id", "search_box")
	.attr("class", "featurebox");

searchbox.append("div")
	.text("Search: ")
	.attr("class", "featuretitle");

searchbox.append("input")
	.attr("class", "featureinput")
	.attr("id", "input_keyword")
	.attr("type", "search")
	.attr("results", "5")
	.attr("name", "input_keyword")
	.on("input", function() {
		// Select nodes with the keyword
		selectByKeyword(this.value);
	})
	.on("click", function() {
		// Select nodes with the keyword
		selectByKeyword(this.value);
	});

// searchbox.append("text")
// 	.text("Search: ")

// searchform = searchbox.append("input")
// 	.attr("id", "input_keyword")
// 	.attr("type", "search")
// 	.attr("results", "5")
// 	.attr("name", "input_keyword")
// 	.on("input", function() {
// 		// Select nodes with the keyword
// 		console.log(this.value);
// 		if(this.value.length > 0 && this.value != undefined)
// 			selectByKeyword(this.value);
// 	});


// Node Editing Box
detailbox.append("div")
	.attr("id", "nodeeditbox");

// Box for uploading files
uploadbox = detailbox.append("div")
	.attr("class", "featurebox");

uploadbox.append("text")
	.text("Upload .bib")
	.attr("class", "featuretitle");

uploadbox.append("input")
	.attr("id", "button_loadBibliography")
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
				addBibliography(e.target.result);
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
		addBibliography(bibtexinputbox[0][0].value);
		bibtexinputbox[0][0].value = "";
    });

bibtexinputbox = featurebox.append("textarea")
	.attr("class", "commentarea")
	.attr("value", "");