"use strict";

// Namespace pattern
var SCORES = SCORES || {};

SCORES.getNoteDifferencePenalty = (a, b, isComparedToUser, loseFactor, loseLenience, gainFactor, gainLenience) => {
	let notesLost = 0;
	let notesGained = 0;

	// Easier settings if not compared to user
	if (!isComparedToUser) {
		loseFactor *= 0.5;
		gainFactor *= 0.5;
	}

	for (let i = 0; i < a.n.length; ++i) {
		if (a.n[i] && !b.n[i]) {
			notesLost++;
		} else if (!a.n[i] && b.n[i]) {
			notesGained++;
		}
	}

	const penalty =
		(Math.max(0.0, notesLost - loseLenience) * loseFactor)
		+ (Math.pow(Math.max(0.0, notesGained - gainLenience), 1.5)
		* gainFactor);
	
	return penalty;

}
