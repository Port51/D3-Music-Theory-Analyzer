"use strict";

// Namespace pattern
var SCORES = SCORES || {};
var numPrinted1 = 0;

var getNoteDifferencePenalty = (a, b, isComparedToUser, loseFactor, loseLenience, gainFactor, gainLenience) => {
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

	const penalty = (Math.max(0.0, notesLost - loseLenience) * loseFactor) + (Math.pow(Math.max(0.0, notesGained - gainLenience), 1.5) * gainFactor);
	
	return penalty;

}

var getTopoIntervalCounts = (mode, factorRootEmphasis) => {
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
var getTopoMelodyScore = (a, b, isComparedToUser, factorRootEmphasis, factorEachDifference, multForEachUnder6) => {
	const intervals = [
		getTopoIntervalCounts(a, factorRootEmphasis),
		getTopoIntervalCounts(b, factorRootEmphasis),
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
	//if (c1 > 10 || c2 > 10) {
	//	console.log(lowerImpact + " from " + smallest + " with " + multForEachUnder7);
	//}

	return score * (1.0 - lowerImpact) + lowerImpact;

}

var getTopoRange = (mode, min, max) => {
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

var getTopoDifference = (r1, r2, testNum, scoreIfHasAll, scoreIfHasNone) => {
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
var getTopoScore = (a, b, isComparedToUser, factorTierI, factorTierII, factorTierIII, scoreIfHasAll, scoreIfHasNone) => {
	// Construct topo ranges
	const r = [[
		getTopoRange(a, 1, 2),
		getTopoRange(a, 3, 4),
		getTopoRange(a, 5, 7),
		getTopoRange(a, 8, 9),
		getTopoRange(a, 10, 11),
	], [
		getTopoRange(b, 1, 2),
		getTopoRange(b, 3, 4),
		getTopoRange(b, 5, 7),
		getTopoRange(b, 8, 9),
		getTopoRange(b, 10, 11),
	]];

	// Compare
	// Tier I = 3rd
	const diffTierI = getTopoDifference(r[0], r[1], 1, scoreIfHasAll, scoreIfHasNone);
	// Tier II = 4th/5th, 7th
	const diffTierII =	getTopoDifference(r[0], r[1], 2, scoreIfHasAll, scoreIfHasNone) +
						getTopoDifference(r[0], r[1], 4, scoreIfHasAll, scoreIfHasNone);
	// Tier III = 2nd, 6th
	const diffTierIII =	getTopoDifference(r[0], r[1], 0, scoreIfHasAll, scoreIfHasNone) +
						getTopoDifference(r[0], r[1], 3, scoreIfHasAll, scoreIfHasNone);
	
	// Score according to tiers
	return 1.0 - (
			(diffTierI * factorTierI) +
			(diffTierII * factorTierII) +
			(diffTierIII * factorTierIII)
		);

}

SCORES.getScore = (a, b, weightFactors) => {
	//const debugPrintAll = (a.isUser == b.isUser && (a.label == b.label && a.label == "Chromatic Scale")) && true;
	const debugPrintAll = (a.isUser != b.isUser) && true;
	const isComparedToUser = (a.isUser || b.isUser);

	const openness = (isComparedToUser) ? weightFactors.allowMoreNotes : weightFactors.allowMoreNotes * 0.5;

	// Ensure roots are contained in both
	if (((!a.n[b.key] && b.n[b.key]) || (!b.n[a.key] && a.n[a.key])) && (a.key !== b.key)) {
		return 0.0;
	}

	// Calculate penalty for note differences
	// SETTINGS: [losePenalty, loseLenience, gainPenalty, gainLenience]
	//	*	Generally good: [0.4, 0.2, 0.1, 0.5]
	//	*	Fill in scale: [1.0, 0.0, 0.0, 0.5]
	const debugUseDiffPenalty = false;
	const settings1 = [0.375 + 0.625 * openness, 0.2 * (1.0 - openness), 0.1 * (1.0 - openness), 0.5];

	const diffPenalty = (debugUseDiffPenalty) ? getNoteDifferencePenalty(a, b, isComparedToUser, settings1[0], settings1[1], settings1[2], settings1[3]) : 0.0;
	const rootPenalty = (a.key !== b.key) ? (1.0 - weightFactors.allowDifferentRoots) : 0.0;
	const initialScore = saturate(1.0 - diffPenalty - rootPenalty);

	if (initialScore > 0.0) {
		// Continue with calculations
		const settings2 = [1.0, 0.45, 0.25, 0.4 - 0.225 * openness, 0.333 * (1.0 - openness)];
		//const settings3 = [1.333 - 0.333 * openness, 0.5 - 0.25 * openness, 0.225 + 0.175 * openness];
		const settings3 = [1.333, 0.5, 0.225];

		const moodScore = getMoodSimilarity_Tone(a, b);

		const moduleScores = [
			// SETTINGS: [tierI, tierII, tierIII, scoreIfHasAll, scoreIfHasNone]
			//	*	Generally good: [1.0, 0.45, 0.25, 0.4, 0.333]... at full weighting will give scale, with no results conflicting on tier I
			//	*	Fill in scale: [1.0, 0.45, 0.25, 0.175, 0.0]
			getTopoScore(a, b, isComparedToUser, settings2[0], settings2[1], settings2[2], settings2[3], settings2[4]),
			// NOTES:
			//		This is good for separating weird modes from normal ones
			// SETTINGS: [weightRoot, kFactor, multForEachUnder6]
			//	*	Generally good: [1.333, 0.5, 0.225]
			//	*	Harsh separation: [1.0, 0.25, 0.4]
			getTopoMelodyScore(a, b, isComparedToUser, settings3[0], settings3[1], settings3[2]),
			moodScore.simHappy,
			moodScore.simBittersweet,
		];

		// Calculate weighted score
		const total = saturate(
					initialScore *
					SCORES.weightByFactor(moduleScores[0], 1.0) *
					SCORES.weightByFactor(moduleScores[1], 1.0) * 
					SCORES.weightByFactor(moduleScores[2], weightFactors.moodEstimation) * 
					SCORES.weightByFactor(moduleScores[3], weightFactors.moodEstimation * 0.67)
				);

		if (debugPrintAll) {
			if (numPrinted1 < 20) {
				console.log(a.name + " compared to " + b.name);
				console.log("Score: " + total);
				console.log("Topo range score: " + moduleScores[0]);
				console.log("Topo melody score: " + moduleScores[1]);
				numPrinted1++;
			}
		}

		return total;

	} else {
		if (debugPrintAll) {
			//console.log(a.name + " compared to " + b.name + " = disqualified with penalty = " + diffPenalty);
		}

		return 0.0;

	}
	
}

/*
	Calculates score from 0.0 to 1.0 based on how similar two modes are
*/
SCORES.getScore3 = (a, b, weightFactors) => {
	const debugPrintAll = true;

	const comps = getCompromiseScore(a, b);

	// Root scores
	const rScore = getRootEqualScore(a.key, b.key);
	const rInclScore = getRootsIncludedScore(a, b);
	const mScores = getMoodSimilarity_Tone(a, b);
	const iCounts = getMoodSimilarity_Intervals(a, b);
	
	let iCountScore = 0.0;
	if (iCounts.same > 0) {
		const zeroCutoff = 0.1; // point at which totally different
		iCountScore = 1.0 - (iCounts.different / iCounts.same);
		iCountScore = (iCountScore - zeroCutoff) / (1.0 - zeroCutoff);
		if (iCountScore < 0.0)
			iCountScore = 0.0;

		// Power factor
		iCountScore = Math.pow(iCountScore, 0.25);
	}

	// How different are variances in interval length? (openness)
	const iVarScore = 1.0 / (1.0 + iCounts.varianceDiff);

	// Calculate weighted score
	const total = saturate(
					SCORES.weightByFactor(comps.noteSim, weightFactors.noteSimilarity) *
					SCORES.weightByFactor(comps.add, weightFactors.addNotes) *
					SCORES.weightByFactor(comps.rem, weightFactors.removeNotes) *
					SCORES.weightByFactor(rScore, weightFactors.rootOffset) *
					SCORES.weightByFactor(mScores.simHappy, weightFactors.moodHappy) *
					SCORES.weightByFactor(mScores.simBittersweet, weightFactors.moodBittersweet) *
					SCORES.weightByFactor(iCountScore, weightFactors.intervalCount) *
					SCORES.weightByFactor(iVarScore, weightFactors.intervalOpenness) *
					SCORES.weightByFactor(rInclScore, weightFactors.rootMissing)
				);
	
	if (debugPrintAll && (a.isUser || b.isUser) && ((a.key == b.key) || a.key == null || b.key == null)) {
		if (numPrinted1 < 5) {
			console.log(a.name + " compared to " + b.name);
			console.log("Score: " + total);
			console.log("Note similarity: " + comps.noteSim);
			console.log("Add score: " + comps.add);
			console.log("Rem score: " + comps.rem);
			console.log("Mood score - happy: " + mScores.simHappy);
			console.log("Mood score - bittersweet: " + mScores.simBittersweet);
			console.log("rScore: " + rScore);
			console.log("Root missing: " + rInclScore);
			console.log("Interval count: " + iCountScore);
			console.log("Interval variance: " + iVarScore);
			numPrinted1++;
		}
	}

	return total;
}

SCORES.avgScores = (a, b) => {
	return { score: (a.score + b.score) * 0.5, comp: (a.comp + b.comp) * 0.5, root: (a.root + b.root) * 0.5, mood: (a.mood + b.mood) * 0.5 };
}

SCORES.weightByFactor = (val, weight) => {
	return val * weight + (1.0 - weight);
}
