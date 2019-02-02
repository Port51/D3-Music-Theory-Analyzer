"use strict";

$(document).ready(() => {
	waitForSVGSize();
});

// If SVG is already sized, create starting graph
// Otherwise check every 0.1 seconds until SVG is sized
var waitForSVGSize = () => {
	const svg = d3.select("svg");
	
	if (+svg.property("viewBox").baseVal.width > 0 && +svg.property("viewBox").baseVal.height > 0) {
		DATA.runStartingGraph();
	} else {
		window.setTimeout(waitForSVGSize, 100);
	}
}