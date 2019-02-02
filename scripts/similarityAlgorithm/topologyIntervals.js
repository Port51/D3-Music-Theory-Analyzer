"use strict";

// Namespace pattern
var SCORES = SCORES || {};

SCORES.getTopoIntervalCounts = (mode, factorRootEmphasis) => {
	// Count # of each interval
	const iNames = ["b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "dom7", "M7"];
	let intervals = [];
	let allPossible = 0;
	for (let i = 1; i <= 11; ++i) {
		let numPossible = 0;
		for (let n = 0; n < mode.c.length; ++n) {
			if (mode.c[n] && mode.c[(n + i) % mode.c.length]) {
				const weightThis = (n === 0) ? factorRootEmphasis : 1.0;
				numPossible += weightThis;
				allPossible += weightThis;
			}
		}
		intervals.push( { 'name': iNames[i - 1], 'count': numPossible } );
	}

	if (allPossible === 0) {
		allPossible = 1;
	}

	// Compute percentages
	for (let i = 0; i < intervals.length; ++i) {
		intervals[i].perc = intervals[i].count / allPossible;
	}

	return intervals;

}

// Possible intervals for melodies
SCORES.getTopoMelodyScore = (a, b, isComparedToUser, factorRootEmphasis, factorEachDifference, multForEachUnder6) => {
	const intervals = [
		SCORES.getTopoIntervalCounts(a, factorRootEmphasis),
		SCORES.getTopoIntervalCounts(b, factorRootEmphasis),
		];

	let sumDiff = 0;
	for (let i = 0; i < intervals[0].length; ++i) {
		let d = intervals[0][i].perc - intervals[1][i].perc;
		if (d < 0) d *= -1;

		sumDiff += d;
	}

	const avgDiff = sumDiff / intervals[0].length;
	const score = Math.pow(2.71, -sumDiff / factorEachDifference);

	// Smaller scales get affected less
	let c1 = 0, c2 = 0;
	for (let i = 0; i < a.n.length; ++i) {
		if (a.c[i]) c1++;
		if (b.c[i]) c2++;
	}

	const smallest = (c1 < c2) ? c1 : c2;
	const lowerImpact = (smallest < 6) ? Math.min(1.0, multForEachUnder6 * (6 - smallest)) : 0.0;

	return score * (1.0 - lowerImpact) + lowerImpact;

}

