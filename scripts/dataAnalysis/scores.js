"use strict";

// Namespace pattern
var SCORES = SCORES || {};
var numScoresPrinted1 = 0;

/*
	Calculates score from 0.0 to 1.0 based on how similar two modes are
*/
SCORES.getScore = (a, b, weightFactors) => {
	const debugPrintAll = (a.isUser != b.isUser) && false;
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
	const debugUseDiffPenalty = true;
	const settings1 = [0.375 + 0.625 * openness, 0.2 * (1.0 - openness), 0.1 * (1.0 - openness), 0.5];

	const diffPenalty = (debugUseDiffPenalty) ? SCORES.getNoteDifferencePenalty(a, b, isComparedToUser, settings1[0], settings1[1], settings1[2], settings1[3]) : 0.0;
	const rootPenalty = (a.key !== b.key) ? (1.0 - weightFactors.allowDifferentRoots) : 0.0;
	const initialScore = saturate(1.0 - diffPenalty - rootPenalty);

	if (initialScore > 0.0) {
		// Continue with calculations
		const settings2 = [1.0, 0.45, 0.25, 0.4 - 0.225 * openness, 0.333 * (1.0 - openness)];
		//const settings3 = [1.333 - 0.333 * openness, 0.5 - 0.25 * openness, 0.225 + 0.175 * openness];
		const settings3 = [1.333, 0.5, 0.225];

		const moodScore = SCORES.getMoodSimilarity_Tone(a, b);

		const moduleScores = [
			// SETTINGS: [tierI, tierII, tierIII, scoreIfHasAll, scoreIfHasNone]
			//	*	Generally good: [1.0, 0.45, 0.25, 0.4, 0.333]... at full weighting will give scale, with no results conflicting on tier I
			//	*	Fill in scale: [1.0, 0.45, 0.25, 0.175, 0.0]
			SCORES.getTopoScore(a, b, isComparedToUser, settings2[0], settings2[1], settings2[2], settings2[3], settings2[4]),
			// NOTES:
			//		This is good for separating weird modes from normal ones
			// SETTINGS: [weightRoot, kFactor, multForEachUnder6]
			//	*	Generally good: [1.333, 0.5, 0.225]
			//	*	Harsh separation: [1.0, 0.25, 0.4]
			SCORES.getTopoMelodyScore(a, b, isComparedToUser, settings3[0], settings3[1], settings3[2]),
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
			if (numScoresPrinted1 < 20) {
				console.log(a.name + " compared to " + b.name);
				console.log("Score: " + total);
				console.log("Topo range score: " + moduleScores[0]);
				console.log("Topo melody score: " + moduleScores[1]);
				numScoresPrinted1++;
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

SCORES.avgScores = (a, b) => {
	return { score: (a.score + b.score) * 0.5, comp: (a.comp + b.comp) * 0.5, root: (a.root + b.root) * 0.5, mood: (a.mood + b.mood) * 0.5 };
}

SCORES.weightByFactor = (val, weight) => {
	return val * weight + (1.0 - weight);
}
