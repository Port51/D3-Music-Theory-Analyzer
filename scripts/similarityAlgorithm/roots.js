"use strict";

let rootCloseness = [1, 0, 0.333, 0, 0, 0.65, 0, 0.75, 0, 0, 0.333, 0, 1];

var getRootCloseness = (a, b) => {
	let interval = b.key - a.key;
	if (interval < 0)
		interval += 12;
	
	let close = rootCloseness[interval % 12];
	
	// Some exceptions
	if (a.label == 'Chromatic' || 
		b.label == 'Chromatic')
			close = 1.0;
	else if (a.label == 'Whole Tone Scale' || 
			b.label == 'Whole Tone Scale')
	{
		if (a.key % 2 == b.key % 2)
			close = 1.0;
		else
			close = 0.0;
	}
	
	return close;
}

var getRootEqualScore = (key1, key2) => {
	if (key1 == null || key2 == null) return 1.0;
	else if (key1 === key2) return 1.0;
	else return 0.0;
}

// Check if modes include each others' roots
var getRootsIncludedScore = (a, b) => {
	let ret = 0.0;
	const searchForNum = ((a.key != null) ? 1 : 0) + ((b.key != null) ? 1 : 0);

	if (searchForNum == 0)
		return 1.0;
	else {
		let foundRoots = 0;
		if (a.key != null) {
			if (b.n[a.key]) {
				foundRoots++;
			}
		}
		if (b.key != null) {
			if (a.n[a.key]) {
				foundRoots++;
			}
		}

		if (foundRoots == searchForNum)
			return 1.0;
		else if (foundRoots == 0)
			return 0.0;
		else {
			return 0.15; // 50% hit rate gives low score
		}

	}
	return 0.0;

}
