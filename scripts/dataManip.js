"use strict";

var saturate = (v) => {
	if (v < 0.0) return 0.0;
	else if (v > 1.0) return 1.0;
	else return v;
}

// Types: 0 = user, 1 = classical/medieval mode, 2 = other mode, 3 = chord(s)
var createGraphNode = (name, group, type, edgeStrMult, impact, svgWidth, svgHeight) => {
	return {
		"id": name,
		"group": group,
		"type": type,
		"edgeStrMult": edgeStrMult,
		"impact": impact,
		"fixed": "TRUE",
		"x": Math.random() * svgWidth,
		"y": Math.random() * svgHeight,
	};
}

// Util function for creating built-in modes
var createMode = (name, type, arr) => {
	let mode = {};
	mode.label = name;
	mode.isUser = false;
	mode.key = 0;
	mode.name = getNoteName(mode.key) + ' ' + mode.label;
	mode.type = type;
	mode.n = [];
	for (let i = 0; i < arr.length; ++i) {
		mode.n.push (arr.charAt(i) !== ' ');
	}
	mode.c = mode.n;
	mode.aliases = [];

	return mode;
}

