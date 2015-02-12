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

	// Add new content
	for (field in citation) {
		value = citation[field];
		featurebox = nodeeditbox.append("div")
			.attr("class", "featurebox");

		featurebox.append("div")
			.text(field)
			.attr("class", "featuretitle");

		featurebox.append("input")
			.data([field])
			.attr("value", value)
			.on("keypress", function(d) {
				// console.log("keypress", node, d3.event.keyCode);
				// console.log(d);
				// console.log(this.value);

				// IE fix
				if (!d3.event)
					d3.event = window.event;

				var e = d3.event;
				if (e.keyCode == 13) { // enter
					if (typeof(e.cancelBubble) !== 'undefined') // IE
						e.cancelBubble = true;
					if (e.stopPropagation)
						e.stopPropagation();
					e.preventDefault();

					citation[d] = this.value;
					editCitation(citekey, citation);
					bibTex2nodes(bibObject);
				}
	        });
	}
}