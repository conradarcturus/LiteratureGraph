// graphinteraction.js

var nodeeditbox = d3.select("#nodeeditbox");

function selectNode (data) {
	// Highlight node
	highlightNode(data.citekey);

	// Update node editing box
	refreshNodeEditBox(data.citekey, data.citation);
}

function highlightNode(citekey) {
	// Remove highlighting from the other ones
	d3.selectAll(".selected")
		.attr("class", function() {
			console.log(this.attr("class"));
			return this.attr("class");
		});
}

function refreshNodeEditBox(citekey, citation) {
	// Clear the previous content
	nodeeditbox.selectAll("*").remove();

	if("title" in citation)
		nodeeditbox.append("div")
			.html(citation.title)
			.attr("class", "title");

	// Title/Author/Year Description
	description = "";
	if("author" in citation)
		description += citation.author + ' ';
	if("year" in citation)
		description += '(' + citation.year + ')';
	if(description.length > 0)
		nodeeditbox.append("div")
			.html(description)
			.attr("class", "authoryear");

	// Add missing fields if necessary
		addFeatureBox("title", citekey, citation);
	// if(!("author" in citation))
		addFeatureBox("author", citekey, citation);
	// if(!("year" in citation))
		addFeatureBox("year", citekey, citation);

	// Add new content
	for (field in citation) {
		// if(field == "read" || field == "title" || field == "author" || field == "year" || field == "citations" || field == "comments") {
		if(["read", "title", "author", "year", "citations", "comments"].indexOf(field) != -1) {
			// do nothing here
		} else {
			addFeatureBox(field, citekey, citation);
		}
	} // For each field

	// Add custom fields
	addFeatureBox("citations", citekey, citation)
	addFeatureBox("read", citekey, citation)
	addCommentBox("comments", citekey, citation);

	nodeeditbox.append("div")
		.text(citekey)
		.attr("class", "citekey");
}


function addFeatureBox(field, citekey, citation) {
	var value = "";
	if(field in citation)
		value = citation[field];

	featurebox = nodeeditbox.append("div")
		.attr("class", "featurebox");

	featurebox.append("div")
		.text(field)
		.attr("class", "featuretitle");

	featurebox.append("input")
		.data([field])
		.attr("value", value)
		.attr("class", "featureinput")
		.on("keyup", function(d) {
			if(d == "citations")
				citation[d] = this.value.split(/[, ]+/);
			else
				citation[d] = this.value;
			editCitation(citekey, citation);
        });

    return featurebox;
}



function addCommentBox(field, citekey, citation) {
	var value = "";
	if(field in citation)
		value = citation[field];

	featurebox = nodeeditbox.append("div")
		.attr("class", "commentbox");

	featurebox.append("div")
		.text(field)
		.attr("class", "featuretitle");

	inputbox = featurebox.append("textarea")
		.attr("class", "commentarea")
		.data([field])
		.text(value)
		.attr("value", value)
		.on("keyup", function(d) {
			console.log(this);
			console.log(this.value);
			citation[d] = this.value;
			console.log(citation);
			editCitation(citekey, citation);
			console.log(bibObject);
        });

    return featurebox;
}