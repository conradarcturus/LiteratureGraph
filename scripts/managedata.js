var bibObject = {};
var btparser = new BibtexParser();

function getBibObject() {
	return bibObject;
}

function setBibObject(data) {
	this.bibObject = data;
}

function clearBibObjectAndRefresh() {
	bibObject = {};
	
	setBibObject(bibObject);

	bibTex2nodes(bibObject);
}

function editCitation(citekey, citation) {
	bibObject[citekey] = citation;
}

function loadBibliography (bibFile) {
	// Read File
	$.get(bibFile, function( bib_data ) {
	    addBibliography(bib_data);
	});
}

function addBibliography (bib_data) {
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

function storeBibliography () {
	bibTexString = makeBibliography();

	localStorage.setItem("LiteratureGraph", bibTexString);
	console.log("Graph saved locally");
}

function exportBibliography () {
	bibTexString = makeBibliography();

	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(bibTexString);
	window.open(url, '_blank');
	window.focus();
}

function makeBibliography () {
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
