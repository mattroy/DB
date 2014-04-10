//sythen.js

$(function() {
	console.log("initializing...");
	
	/*Dialog Creation*/
	var dialog = $("#dialog").dialog({
		autoOpen: false
	});
	
	$("#newButton").click(function() {
		console.log("open save dialog");
		$("#dialog").dialog("open");
	});
	
	/*Setup Player*/
	
	/*Load Sounds*/
	
	//TODO: remove web dependencies
});