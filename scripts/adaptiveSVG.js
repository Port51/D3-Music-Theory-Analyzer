"use strict";

$(document).ready(() => {
	waitForSVGSize();
});

var waitForSVGSize = () => {
	const svg = d3.select("svg");
	//alert (+svg.property("viewBox").baseVal.width);
	if (+svg.property("viewBox").baseVal.width > 0 && +svg.property("viewBox").baseVal.height > 0) {
		runStartingGraph();
	} else {
		window.setTimeout(waitForSVGSize, 100);
	}
}