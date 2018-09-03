"use strict";

// Types: 0 = user, 1 = classical/medieval mode, 2 = other mode, 3 = chord(s)
var createGraphNode = (name, group, type, svgWidth, svgHeight) => {
	return {
		"id": name,
		"group": group,
		"type": type,
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

// Expands list of modes to include each mode in all possible keys
// Transposes the notes in each mode accordingly
var expandModesToAllKeys = (modes) => {
	let newList = [];
	for (let i = 0; i < modes.length; ++i)
	{
		// Factor in special cases where NOTES_IN_SCALEs don't emphasize one root
		let useKeys = NOTES_IN_SCALE;
		let rootIndependent = false;
		if (modes[i].isUser) {
			useKeys = 1;
		}
		else if (modes[i].label === "Whole Tone NOTES_IN_SCALE") {
			useKeys = 2;
			rootIndependent = true;
		}
		else if (modes[i].label === "Chromatic") {
			useKeys = 1;
			rootIndependent = true;
		}

		for (let key = 0; key < useKeys; ++key) {
			let newMode = {};
			newMode.isUser = modes[i].isUser;
			newMode.key = key;
			newMode.type = modes[i].type;

			newMode.label = modes[i].label;
			newMode.name = getNoteName(newMode.key) + ' ' + newMode.label;

			// Copy untransposed notes directly for analysis
			// that does not have key as a factor
			// (mood detection, interval statistics, etc.)
			newMode.c = modes[i].c;

			// Store transposed version of each note
			newMode.n = [];
			for (let j = 0; j < NOTES_IN_SCALE; ++j) {
				newMode.n.push( modes[i].n[ (j - key + 24) % NOTES_IN_SCALE ] );
			}

			newList.push(newMode);

		}
	}
	return newList;
}

