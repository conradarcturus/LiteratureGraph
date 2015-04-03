var bibliography = {};
var btparser = new BibtexParser();

function getBibliography() {
	return bibliography;
}

function setBibliography(data) {
	this.bibliography = data;
}

function clearBibliographyAndRefresh() {
	bibliography = {};
	
	setBibliography(bibliography);

	bibTex2nodes(bibliography);
}

function editCitation(citekey, citation) {
	bibliography[citekey] = citation;
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

    // Get keywords for the entries
    for (citekey in entries) {
    	citation = entries[citekey];
    	words = "";
    	for (key in citation) {
    		if(["title", "author", "year", "abstract", "comments"].indexOf(key) != -1) {
    			words += " | " + citation[key].toLowerCase();
	    	}
    		if(["field", "topics"].indexOf(key) != -1) {
    			words += " | " + citation[key].join(" ").toLowerCase();
	    	}
    	}
    	citation.words = words;
    }

	// Merge with previous bibliography object
	bibliography = $.extend({}, bibliography, entries);
	setBibliography(bibliography);

	// Reset the graph
	bibTex2nodes(bibliography);
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
	for (var citation in bibliography) {
		citetype = "inproceedings";
		if("type" in bibliography[citation])
			citetype = bibliography[citation].type;

		var citestr = "@" + citetype + "{" + citation;

		for (var key in bibliography[citation]) {
			if(key != "type" && key != "words") {
				value = bibliography[citation][key];
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
