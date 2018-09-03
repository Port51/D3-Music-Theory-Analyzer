"use strict";

/*
	Calculates score from 0.0 to 1.0 based on how similar two modes are
*/
var score = (a, b, settings) => {
    const debugPrintAll = false;

	const comps = getCompromiseScore(a, b, settings);
	const noteSimScore = comps.noteSim;
	const addScore = comps.add;
	const remScore = comps.rem;

	//const rScore = getRootCloseness(a, b);
	const rScore = (a.key === b.key) ? 1.0 : 0.0;
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
	let iVarScore = 1.0 / (1.0 + iCounts.varianceDiff);

	// Set weights
	const wRootMissingPenalty = settings.wFactorRootMissing;
	const wComp = settings.wFactorNoteSimilarity;
	const wAdd = settings.wFactorAdd;
	const wRem = settings.wFactorRemove;
	const wRoot = settings.wFactorRootOffset;
	const wMoodHappy = settings.wFactorMoodHappy;
	const wMoodBittersweet = settings.wFactorMoodBittersweet;
	const wIntervalCount = settings.wFactorIntervalCount;
	const wIntervalVarDiff = settings.wFactorIntervalOpenness;

	let total = (noteSimScore * wComp + (1.0 - wComp)) *
				(addScore * wAdd + (1.0 - wAdd)) *
				(remScore * wRem + (1.0 - wRem)) *
				(rScore * wRoot + (1.0 - wRoot)) *
				(mScores.simHappy * wMoodHappy + (1.0 - wMoodHappy)) *
				(mScores.simBittersweet * wMoodBittersweet + (1.0 - wMoodBittersweet)) *
				(iCountScore * wIntervalCount + (1.0 - wIntervalCount)) *
				(iVarScore * wIntervalVarDiff + (1.0 - wIntervalVarDiff)) *
				(comps.rootMissingPenalty * wRootMissingPenalty + (1.0 - wRootMissingPenalty));
	if (total < 0.0) total = 0.0;
	if (total > 1.0) total = 1.0;

	if (debugPrintAll && (a.isUser || b.isUser)) {
        console.log(a.name + " compared to " + b.name);
        console.log("Score: " + total);
        console.log("Note similarity: " + noteSimScore);
        console.log("Add score: " + addScore);
        console.log("Rem score: " + remScore);
        console.log("Mood score - happy: " + mScores.simHappy);
        console.log("Mood score - bittersweet: " + mScores.simBittersweet);
        console.log("rScore: " + rScore);
        console.log("Root missing: " + comps.rootMissingPenalty);
        console.log("Interval count: " + iCountScore);
        console.log("Interval variance: " + iVarScore);
	}

	return total;
}

var avgScores = (a, b) => {
	return { score: (a.score + b.score) * 0.5, comp: (a.comp + b.comp) * 0.5, root: (a.root + b.root) * 0.5, mood: (a.mood + b.mood) * 0.5 };
}
