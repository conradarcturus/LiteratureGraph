// // Load external dependencies

// try { // See if we have them on our machine
// 	$.getScript("external_scripts/d3.v3.min.js.js", function(){
// 	   console.log("D3 loaded");
// 	});
// 	$.getScript("external_scripts/jquery.min.js", function(){
// 	   console.log("JQuery loaded");
// 	});
// } catch(err) { // If that doesn't work, try getting it from the web
// 	$.getScript("http://d3js.org/d3.v3.min.js.js", function(){
// 	   console.log("D3 loaded");
// 	});
// 	$.getScript("http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js", function(){
// 	   console.log("JQuery loaded");
// 	});
// }

// Load internal frameworks
$.getScript("scripts/bibtex_js.js", function(){
	console.log("BibTex_JS loaded");
	$.getScript("scripts/managedata.js", function(){
		console.log("Data Management loaded");

		$.getScript("scripts/detailbox.js", function(){
		   console.log("Detail Box loaded");
		});
		$.getScript("scripts/graphframework.js", function(){
		   console.log("Graph Framework loaded");
		   

			storedBibliography = localStorage.LiteratureGraph;
			if(!storedBibliography || storedBibliography == "[object Object]") { // this call isn't correct
				loadBibFile("hcdereview.bib");
			} else {
				addBibliography(storedBibliography);
			}

			setInterval(storeBibliography, 60 * 1000); // Every minute save the current graph
		});
		$.getScript("scripts/nodeediting.js", function(){
		   console.log("Node Editing loaded");
		});
		$.getScript("scripts/graphmenu.js", function(){
		   console.log("Graph Menu loaded");
		});
	});
});