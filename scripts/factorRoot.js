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