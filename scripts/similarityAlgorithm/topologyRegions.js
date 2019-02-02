"use strict";

// Namespace pattern
var SCORES = SCORES || {};

SCORES.getTopoRange = (mode, min, max) => {
	let key = 0;
	let numMissing = 0;
	let hasAny = false;
	for (let i = min; i <= max; ++i) {
		key *= 2;
		if (mode.c[i]) {
			key++;
			hasAny = true;
		} else {
			numMissing++;
		}
	}
	return { 'key': key, 'numMissing': numMissing, 'hasNone': !hasAny };
}

SCORES.getTopoDifference = (r1, r2, testNum, scoreIfHasAll, scoreIfHasNone) => {
	// Check if different
	if (r1[testNum].key !== r2[testNum].key) {
		// If either have ALL possibilities and the other is just missing 1, score that less

		const m1 = ((r1[testNum].numMissing === 0 && r2[testNum].numMissing === 1) ||
			(r1[testNum].numMissing === 1 && r2[testNum].numMissing === 0)) ? scoreIfHasAll : 1.0;
		const m2 = (r1[testNum].hasNone || r2[testNum].hasNone) ? scoreIfHasNone : 1.0;

		return 1.0 * Math.min(m1, m2);

	} else {
		return 0.0;
	}
}

// scoreIfDoubled => multiplier to situations like "both 3rds vs minor 3rd"
SCORES.getTopoScore = (a, b, isComparedToUser, factorTierI, factorTierII, factorTierIII, scoreIfHasAll, scoreIfHasNone) => {
	// Construct topo ranges
	const r = [[
		SCORES.getTopoRange(a, 1, 2),
		SCORES.getTopoRange(a, 3, 4),
		SCORES.getTopoRange(a, 5, 7),
		SCORES.getTopoRange(a, 8, 9),
		SCORES.getTopoRange(a, 10, 11),
	], [
		SCORES.getTopoRange(b, 1, 2),
		SCORES.getTopoRange(b, 3, 4),
		SCORES.getTopoRange(b, 5, 7),
		SCORES.getTopoRange(b, 8, 9),
		SCORES.getTopoRange(b, 10, 11),
	]];

	// Compare
	// Tier I = 3rd
	const diffTierI =	SCORES.getTopoDifference(r[0], r[1], 1, scoreIfHasAll, scoreIfHasNone);
	// Tier II = 4th/5th, 7th
	const diffTierII =	SCORES.getTopoDifference(r[0], r[1], 2, scoreIfHasAll, scoreIfHasNone) +
						SCORES.getTopoDifference(r[0], r[1], 4, scoreIfHasAll, scoreIfHasNone);
	// Tier III = 2nd, 6th
	const diffTierIII =	SCORES.getTopoDifference(r[0], r[1], 0, scoreIfHasAll, scoreIfHasNone) +
						SCORES.getTopoDifference(r[0], r[1], 3, scoreIfHasAll, scoreIfHasNone);
	
	// Score according to tiers
	return 1.0 - (
			(diffTierI * factorTierI) +
			(diffTierII * factorTierII) +
			(diffTierIII * factorTierIII)
		);

}
