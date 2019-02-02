"use strict";

var ALGO = ALGO || {};

const NOTES_IN_SCALE = 12;

ALGO.runSimulation = (settings) => {
	console.log("Starting algorithm...")

	// Trigger collapse settings
	$('#settings-collapse').trigger('click');
	const exa = createUserMode();

	const useGraph = true;
	if (!useGraph) {
		// DEBUG: Just print results to console
		ALGO.runAnalysis(settings, exa);
	}
	else {
		// DEBUG: Handle D3 graph
		const svg = d3.select("svg");
		const width = +svg.property("viewBox").baseVal.width;
		const height = +svg.property("viewBox").baseVal.height;

		const algoResults = ALGO.runAnalysis(settings, exa);
		const graph = convertAnalysisToGraph(algoResults.modes, algoResults.pairs, 2, { svgWidth: width, svgHeight: height, 'settings': settings } );
		
		// DEBUG: This is for saving default graphs as JSON objects
		//console.log(JSON.stringify(graph));

		createD3Graph(graph, exa.name);


	} // end useGraph
} // end runSim

ALGO.runAnalysis = (settings, exa) => {

	// Construct list of modes
	let modes = DATA.getTempData(settings.datasets);
	
	modes = filterIdenticalModes(modes);

	if (settings.weightFactors.allowDifferentRoots > 0.05) {
		modes = ALGO.expandModesToAllKeys(modes);
	} else {
		modes = ALGO.setModesToKey(modes, exa.key);
	}
	
	// Add input as a mode
	modes.push(exa);

	// Run the algorithm
	const pairs = ALGO.getTwoLevelSimilarityPairs(modes, settings.weightFactors, settings.displayNumResults, [0.15, 0.3, 0.2, 0.1]);

	// Return results
	return { 'pairs': pairs, 'modes': modes };
}

ALGO.getTwoLevelSimilarityPairs = (modes, weightFactors, maxNodes, cutoffs) => {
	const M = modes.length;
	const userID = ALGO.getUserModeID(modes);
	const userKey = modes[userID].key;

	let alreadyScored = new Set();

	// Compare all modes to user mode
	let pairs = {
		layer0_1: [],
		layer1: [],
		layer1_2: [],
		layer2: [],
	};
	let numZeroScores = 0;
	let comparisonsRun = 0;

	// Add connections from user modes to 1st layer
	let set_DetectedLayer1 = new Set();
	for (let i = 0; i < M; ++i) {
		if (i != userID) {
			const key1 = M * userID + i;
			const key2 = M * i + userID;
			if (!alreadyScored.has(key1) && !alreadyScored.has(key2)) {
				alreadyScored.add(key1);
				alreadyScored.add(key2);

				// Calculate a directional score
				// Where the source is the user mode and the target is the non-user mode
				const s = SCORES.getScore(modes[userID], modes[i], weightFactors);

				if (s >= cutoffs[0]) {
					// Save interaction
					pairs.layer0_1.push( { a: userID, b: i, score: s } );
					set_DetectedLayer1.add(i);

				}
				comparisonsRun++;
			}

		}

	}

	// Filter layer 1
	const maxLayer1 = Math.ceil(0.7 * maxNodes);
	let maxLayer2 = maxNodes - maxLayer1;

	pairs.layer0_1 = pairs.layer0_1.sort((a, b) => { return a.score < b.score; } );
	if (pairs.layer0_1.length > maxLayer1) {
		pairs.layer0_1 = pairs.layer0_1.slice(0, maxLayer1);
	} else {
		maxLayer2 = maxNodes - pairs.layer0_1.length;
	}

	let set_FilteredLayer1 = new Set(pairs.layer0_1);
	

	// Now compare those modes to every mode (layer 1, and layer 1-2)
	for (let src = 0; src < pairs.layer0_1.length; ++src) {
		const i = pairs.layer0_1[src].b;

		for (let j = 0; j < M; ++j) {
			if (!modes[j].isUser && j != i) {
				const isLayer1 = set_DetectedLayer1.has(j);

				// Only compare to other sources once
				if (!isLayer1 || j > i) {
					const key1 = M * i + j;
					const key2 = M * j + i;
					if (!alreadyScored.has(key1) && !alreadyScored.has(key2)) {
						alreadyScored.add(key1);
						alreadyScored.add(key2);
						// Calculate max of both scores
						// To get an undirected score
						const s = Math.max(SCORES.getScore(modes[i], modes[j], weightFactors),
								SCORES.getScore(modes[j], modes[i], weightFactors));

						if (s >= (isLayer1 ? cutoffs[1] : cutoffs[2])) {
							// Save interaction
							if (set_DetectedLayer1.has(j)) {
								pairs.layer1.push( { a: i, b: j, score: s } );
							} else {
								pairs.layer1_2.push( { a: i, b: j, score: s } );
							}
							
						}
						comparisonsRun++;
					}
				}

			}
		}
	}

	// Filter layer 1
	pairs.layer1_2 = pairs.layer1_2.sort((a, b) => { return a.score < b.score; } );
	if (pairs.layer1_2.length > maxLayer2) {
		pairs.layer1_2 = pairs.layer1_2.slice(0, maxLayer2);
	}

	// Now compare outer modes amonst themselves
	for (let src1 = 0; src1 < pairs.layer1_2.length - 1; ++src1) {
		const i = pairs.layer1_2[src1].b;

		for (let src2 = src1 + 1; src2 < pairs.layer1_2.length; ++src2) {
			const j = pairs.layer1_2[src2].b;

			const key1 = M * i + j;
			const key2 = M * j + i;
			if (!alreadyScored.has(key1) && !alreadyScored.has(key2)) {
				alreadyScored.add(key1);
				alreadyScored.add(key2);
				// Calculate max of both scores
				// To get an undirected score
				const s = Math.max(SCORES.getScore(modes[i], modes[j], weightFactors),
						SCORES.getScore(modes[j], modes[i], weightFactors));

				if (s >= cutoffs[3]) {
					// Save interactions
					pairs.layer2.push( { a: i, b: j, score: s } );
				}
				comparisonsRun++;

			}
		}
	}

	// DEBUG: Output for algorithm testing
	/*
	console.log(M);
	console.log(pairs.layer0_1.length);
	console.log(pairs.layer1.length);
	console.log(pairs.layer1_2.length);
	console.log(pairs.layer2.length);
	*/

	console.log("COMPLETED! Calculated " + comparisonsRun.toString() + " comparisons total");

	const totalEdges = pairs.layer0_1.length + pairs.layer1.length + pairs.layer1_2.length + pairs.layer2.length;
	console.log("The algorithm found " + totalEdges.toString() + " scores above zero");

	return pairs;

}

ALGO.getAllSimilarityPairs = (modes, weightFactors) => {
	const M = modes.length;

	// Compare all possible pairs of notes
	let pairs = [];
	let scores = [];
	let numZeroScores = 0;
	let comparisonsRun = 0;
	for (let i = 0; i < M - 1; ++i) {
		for (let j = i + 1; j < M; ++j) {
			// Determine similarity score
			let s = 0.0;

			// XOR isUser property
			if (modes[i].isUser != modes[j].isUser) {
				// Calculate a directional score
				// Where the source is the user mode and the target is the non-user mode
				if (modes[i].isUser) {
					s = SCORES.getScore(modes[i], modes[j], weightFactors);
				} else {
					s = SCORES.getScore(modes[j], modes[i], weightFactors);
				}
			} else {
				// Calculate both scores and average them
				// To get an undirected score
				s = (SCORES.getScore(modes[i], modes[j], weightFactors) +
					SCORES.getScore(modes[j], modes[i], weightFactors)) * 0.5;
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
			comparisonsRun++;

		}
	}

	console.log("COMPLETED! Calculated " + comparisonsRun.toString() + " comparisons total");
	console.log("The algorithm found " + pairs.length.toString() + " scores above zero");

	const positiveScorePercentage = (pairs.length > 0) ? 100 * (1.0 - pairs.length / comparisonsRun) : 0;
	console.log("   Avg = " + (Math.round(avg(scores) * 100) / 100).toString() + ", positive scores: " + Math.round(positiveScorePercentage).toString() + "%");

	return pairs;

}

// Expands list of modes to include each mode in all possible keys
// Transposes the notes in each mode accordingly
ALGO.expandModesToAllKeys = (modes) => {
	let expandedModes = [];
	for (let i = 0; i < modes.length; ++i)
	{
		// Factor in special cases where NOTES_IN_SCALEs don't emphasize one root
		let useKeys = NOTES_IN_SCALE;
		let rootIndependent = false;
		if (modes[i].isUser) {
			useKeys = 1;
		}
		else if (modes[i].label === "Whole Tone NOTES_IN_SCALE") {
			useKeys = 2;
			rootIndependent = true;
		}
		else if (modes[i].label === "Chromatic") {
			useKeys = 1;
			rootIndependent = true;
		}

		for (let key = 0; key < useKeys; ++key) {
			let newMode = {};
			newMode.isUser = modes[i].isUser;
			newMode.key = key;
			newMode.type = modes[i].type;

			newMode.label = modes[i].label;
			newMode.name = getNoteName(newMode.key) + ' ' + newMode.label;

			// Copy untransposed notes directly for analysis
			// that does not have key as a factor
			// (mood detection, interval statistics, etc.)
			newMode.c = modes[i].c;

			// Store transposed version of each note
			newMode.n = [];
			for (let j = 0; j < NOTES_IN_SCALE; ++j) {
				newMode.n.push( modes[i].n[ (j - key + 24) % NOTES_IN_SCALE ] );
			}

			expandedModes.push(newMode);

		}
	}
	
	console.log("Expanded dataset to different keys, expanding from size " + modes.length.toString() + " to " + expandedModes.length.toString());

	return expandedModes;
}

// Expands list of modes to include each mode in all possible keys
// Transposes the notes in each mode accordingly
ALGO.setModesToKey = (modes, key) => {
	for (let i = 0; i < modes.length; ++i)
	{
		modes[i].key = key;
		modes[i].name = getNoteName(key) + ' ' + modes[i].label;

		// Store transposed version of each note
		modes[i].n = [];
		for (let j = 0; j < NOTES_IN_SCALE; ++j) {
			modes[i].n.push( modes[i].c[ (j - key + 24) % NOTES_IN_SCALE ] );
		}

	}
	
	console.log("Set " + modes.length.toString() + " modes to key = " + key.toString());

	return modes;
}

ALGO.getUserModeID = (modes) => {
	for (let i = 0; i < modes.length; ++i) {
		if (modes[i].isUser) {
			return i;
		}
	}
	return -1;

}

ALGO.getStringFromEachMode = (modes, stringF, filterF) => {
	let res = "";
	for (let i = 0; i < modes.length; ++i) {
		if (filterF(modes[i])) {
			res += stringF(modes[i]);
		}
		
	}
	return res;

}



