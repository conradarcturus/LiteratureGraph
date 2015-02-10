var bibObject = {};
// bibObject["practice"] = {};
// bibObject["practice"].year = 2015;
// bibObject["practice"].author = "Conrad";


function getBibObject() {
	return bibObject;
}

function setBibObject(data) {
	this.bibObject = data;
}

function loadBibFile (bibFile) {
	// Read File
	$.get(bibFile, function( bib_data ) {
	    var btparser = new BibtexParser();
	    btparser.setInput(bib_data);
	    btparser.bibtex();

	    // iterate over bibTeX entries
	    var entries = btparser.getEntries();

		// Merge with previous bibliography object
		bibObject = $.extend({}, bibObject, entries);
		setBibObject(bibObject);
	});
}



function saveBibFile (bibFile) {
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
	data = data.join(",\n");
	console.log(data);

	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
	window.open(url, '_blank');
	window.focus();


// @inproceedings{kriplean2012supporting,
//   title={Supporting reflective public thought with considerit},
//   author={Kriplean, Travis and Morgan, Jonathan and Freelon, Deen and Borning, Alan and Bennett, Lance},
//   booktitle={Proceedings of the ACM 2012 conference on Computer Supported Cooperative Work},
//   pages={265--274},
//   year={2012},
//   citations=[munson2010presenting],
//   organization={ACM}
}

loadBibFile("hcdereview.bib");
// saveBibFile("hcdereview2.bib");
