var bibObject = {};
var btparser = new BibtexParser();

function getBibObject() {
	return bibObject;
}

function setBibObject(data) {
	this.bibObject = data;
}

function editCitation(citekey, citation) {
	bibObject[citekey] = citation;
}

		// // Store
		// localStorage.setItem("lastname", "Smith");
		// // Retrieve
		// document.getElementById("result").innerHTML = localStorage.getItem("lastname");

function loadBibFile (bibFile) {
	// Read File
	$.get(bibFile, function( bib_data ) {
	    addBibTex(bib_data);
	});
}

// Try to automatically load the data file
// if(document.location.hostname == "localhost")
// window.onload = function() {loadBibFile("hcdereview.bib");};

function addBibTex (bib_data) {
	btparser = new BibtexParser();
    btparser.setInput(bib_data);
    btparser.bibtex();

    // iterate over bibTeX entries
    var entries = btparser.getEntries();

	// Merge with previous bibliography object
	bibObject = $.extend({}, bibObject, entries);
	setBibObject(bibObject);

	// Reset the graph
	bibTex2nodes(bibObject);
}

function storeBibTex () {
	bibTexString = makeBibTex();

	localStorage.setItem("LiteratureGraph", bibTexString);
	console.log("Graph saved locally");
}

function exportBibTex () {
	bibTexString = makeBibTex();

	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(bibTexString);
	window.open(url, '_blank');
	window.focus();
}

function makeBibTex () {
	// Write each entry
	var bibTexString = [];
	for (var citation in bibObject) {
		citetype = "inproceedings";
		if("type" in bibObject[citation])
			citetype = bibObject[citation].type;

		var citestr = "@" + citetype + "{" + citation;

		for (var key in bibObject[citation]) {
			if(key != "type") {
				value = bibObject[citation][key];
				if(value.constructor == Array)
					value = '[' + value.join(",") + ']';
				else
					value = '{' + value + '}';
				citestr += ",\n  " + key + "=" + value;
			}
		}

		citestr += "\n}";
		bibTexString[bibTexString.length] = citestr;
	}
	bibTexString = bibTexString.join("\n");

	return bibTexString;
}
