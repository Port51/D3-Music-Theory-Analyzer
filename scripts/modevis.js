"use strict";

const NOTES_IN_SCALE = 12;

var runAnalysis = (edgeCutoff, settings, exa) => {
	// Construct list of modes
	let modes = [];
	const datasetID = parseInt(settings.datasetID);
	if (datasetID === 0)
		modes = getMedievalModes();
	else if (datasetID === 1)
		modes = getTempData();
	else if (datasetID === 2) {
		const M = 30;
		for (let i = 0; i < M; ++i) {
			modes.push(randomMode());
		}
	} else if (datasetID === 3) {
		modes = getDebugModes();
	}

	modes = filterIdenticalModes(modes);
	modes = expandModesToAllKeys(modes);

	// Add input NOTES_IN_SCALE as a mode
	modes.push(exa);

	// Run the algorithm
	let pairs = getAllSimilarityPairs(modes, settings);
	// Filter by score
	pairs = pairs.filter(pair => pair.score >= edgeCutoff);

	// Return results
	return { 'pairs': pairs, 'modes': modes };
}

var getAllSimilarityPairs = (modes, settings) => {
	const M = modes.length;

	// Compare all possible pairs of notes
	let pairs = [];
	let scores = [];
	let numZeroScores = 0;
	for (let i = 0; i < M - 1; ++i) {
		for (let j = i + 1; j < M; ++j) {
			// Determine similarity score
			let s = 0.0;

			// XOR isUser property
			if (modes[i].isUser != modes[j].isUser) {
				// Calculate a directional score
				// Where the source is the user mode and the target is the non-user mode
				if (modes[i].isUser) {
					s = score(modes[i], modes[j], settings);
				} else {
					s = score(modes[j], modes[i], settings);
				}
			} else {
				// Calculate both scores and average them
				// To get an undirected score
				s = (score(modes[i], modes[j], settings) +
					score(modes[j], modes[i], settings)) * 0.5;
			}

			// Save score for statistics
			scores.push(s);

			if (s <= 0.0) {
				// Don't save interactions at or below zero
				numZeroScores++;
			} else {
				// Save interaction if score > 0.0
				pairs.push( { a: modes[i], b: modes[j], score: s } );
			}

		}
	}

	console.log("COMPLETED! Calulated " + pairs.length.toString() + " scores");

	const zeroScorePercentage = (pairs.length > 0) ? 100 * numZeroScores / pairs.length : 0;
	console.log("   Avg = " + (Math.round(avg(scores) * 100) / 100).toString() + ", zero scores: " + Math.round(zeroScorePercentage).toString() + "%");

	return pairs;

}




