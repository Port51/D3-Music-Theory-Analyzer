"use strict";

// Filters out identical modes
// Stores them as aliases within other modes so they can be displayed later
var filterIdenticalModes = (modes) => {
	let used = {}; // key = notes, val = id of parent
	let uniqueModes = []; // list of filtered modes
	for (let i = 0; i < modes.length; ++i) {
		if (modes[i].isUser) {
			// User modes are always kept separate
			uniqueModes.push(modes[i]);
		} else {
			const key = repNotesAsString(-1, modes[i].c);
			if (!(key in used)) {
				// I am the first mode discovered with this NOTES_IN_SCALE
				// Save this ID
				used[key] = uniqueModes.length;

				// Use in final dataset
				uniqueModes.push(modes[i]);
			} else {
				// There's already an identical key
				// So add myself to that mode's aliases
				const parent = parseInt(used[key]);
				console.log(parent);
				uniqueModes[parent].aliases.push(modes[i].label);
			}
		}
	}
	console.log("Filtered for unique modes, reducing dataset from size " + modes.length.toString() + " to " + uniqueModes.length.toString());

	return uniqueModes;
}