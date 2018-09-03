"use strict";

// Convert notes in mode into string that's easy to compare with other modes
// Each character represents a note
// KEY:
// '@'  =  Root note, included in mode
// '.'  =  Root note, absent from mode
// '#'  =  Regular note, included in mode
// ' '  =  Regular note, absent from mode
var repNotesAsString = (key, arr) => {
	let display = "";
	for (let i = 0; i < arr.length; ++i) {
		if (arr[i]) {
			display += (i == key) ? "@" : "#";
		}
		else {
			display += (i == key) ? "." : " ";
		}
	}
	return display;
}

var makeModePrintable = (mode) => {
	return '[' + repNotesAsString(mode.key, mode.n) + ']  ' + mode.name;
}

var getNoteName = (id) => {
	id = id % NOTES_IN_SCALE;
	if (id == 0) return 'C';
	else if (id == 1) return 'C#';
	else if (id == 2) return 'D';
	else if (id == 3) return 'Eb';
	else if (id == 4) return 'E';
	else if (id == 5) return 'F';
	else if (id == 6) return 'F#';
	else if (id == 7) return 'G';
	else if (id == 8) return 'Ab';
	else if (id == 9) return 'A';
	else if (id == 10) return 'Bb';
	else if (id == 11) return 'B';
}


