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

function makeBibTex () {
	// Write each entry
	var data = [];
	for (var citation in bibObject) {
		var citestr = "@inproceedings{" + citation;

		for (var key in bibObject[citation]) {
			value = bibObject[citation][key];
			if(value.constructor == Array)
				value = '[' + value.join(",") + ']';
			else
				value = '{' + value + '}';
			citestr += ",\n  " + key + "=" + value;
		}

		citestr += "\n}";
		data[data.length] = citestr;
	}
	data = data.join("\n");
	console.log(data);

	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
	window.open(url, '_blank');
	window.focus();
}
