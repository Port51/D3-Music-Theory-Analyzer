"use strict";

const SCALE = 12;

// Convert notes in mode into string that's easy to compare with other modes
// Each character represents a note
// KEY:
// '@'  =  Root note, included in mode
// '.'  =  Root note, absent from mode
// '#'  =  Regular note, included in mode
// ' '  =  Regular note, absent from mode
var repNotesAsString = (key, arr) => {
	let display = "";
	for (let i = 0; i < arr.length; ++i) {
		if (arr[i]) {
			display += (i == key) ? "@" : "#";
		}
		else {
			display += (i == key) ? "." : " ";
		}
	}
	return display;
}

var makeModePrintable = (mode) => {
	return '[' + repNotesAsString(mode.key, mode.n) + ']  ' + mode.name;
}

var GetNoteName = (id) => {
	id = id % 12;
	if (id == 0) return 'C';
	else if (id == 1) return 'C#';
	else if (id == 2) return 'D';
	else if (id == 3) return 'Eb';
	else if (id == 4) return 'E';
	else if (id == 5) return 'F';
	else if (id == 6) return 'F#';
	else if (id == 7) return 'G';
	else if (id == 8) return 'Ab';
	else if (id == 9) return 'A';
	else if (id == 10) return 'Bb';
	else if (id == 11) return 'B';
}

// Util function for creating built-in modes
var createMode = (name, type, arr) => {
	let mode = {};
	mode.label = name;
	mode.isUser = false;
	mode.key = 0;
	mode.name = GetNoteName(mode.key) + ' ' + mode.label;
	mode.type = type;
	mode.n = [];
	for (let i = 0; i < arr.length; ++i) {
        mode.n.push (arr.charAt(i) !== ' ');
	}
	mode.c = mode.n;
	mode.aliases = [];

	return mode;
}

var randomMode = () => {
	let mode = {};
	mode.label = Math.random().toString(26).substr(2, 5);
	mode.isUser = false;
	mode.type = 2;
	mode.key = 0;
	mode.name = GetNoteName(mode.key) + ' ' + mode.label;
	mode.n = [];
	for (let i = 0; i < SCALE; ++i)
		mode.n.push(false);

	const key = Math.floor(Math.random() * SCALE) + 12;
	let i = 0;
	while (i < SCALE) {
		mode.n[(key + i) % SCALE] = true;

		// Random interval
		const rr = Math.random() * 1000;
		if (rr < 100)
			i++;
		else if (rr < 170)
			i += 3;
		else if (rr < 220)
			i += 4;
		else
			i += 2;
	}
	mode.c = mode.n;
	mode.aliases = [];

	return mode;
}

var avg = (arr) => {
	let total = 0.0;
	for (let i = 0; i < arr.length; ++i) {
		total += Math.abs(arr[i]);
	}
	return total / arr.length;
}

var variance = (arr) => {
	let total = 0.0;
	for (let i = 0; i < arr.length; ++i) {
		total += arr[i] * arr[i];
	}
	return total / arr.length;
}


// Filters out identical modes
// Stores them as aliases within other modes so they can be displayed later
var filterIdenticalModes = (modes) => {
	let used = {}; // key = notes, val = id of parent
	let uniqueModes = []; // list of filtered modes
	for (let i = 0; i < modes.length; ++i) {
        if (modes[i].isUser) {
            // User modes are always kept separate
            uniqueModes.push(modes[i]);
        } else {
            const key = repNotesAsString(-1, modes[i].c);
            if (!(key in used)) {
                // I am the first mode discovered with this scale
                // Save this ID
                used[key] = uniqueModes.length;

                // Use in final dataset
                uniqueModes.push(modes[i]);
            } else {
                // There's already an identical key
                // So add myself to that mode's aliases
                const parent = parseInt(used[key]);
                console.log(parent);
                uniqueModes[parent].aliases.push(modes[i].label);
            }
        }
	}
	console.log("Filtered for unique modes, reducing dataset from size " + modes.length.toString() + " to " + uniqueModes.length.toString());

	return uniqueModes;
}

// Expands list of modes to include each mode in all possible keys
// Transposes the notes in each mode accordingly
var expandModesToAllKeys = (modes) => {
	let newList = [];
	for (let i = 0; i < modes.length; ++i)
    {
        // Factor in special cases where scales don't emphasize one root
		let useKeys = 12;
		let rootIndependent = false;
		if (modes[i].isUser) {
			useKeys = 1;
		}
		else if (modes[i].label === "Whole Tone Scale") {
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
			newMode.name = GetNoteName(newMode.key) + ' ' + newMode.label;

			// Copy untransposed notes directly for analysis
			// that does not have key as a factor
			// (mood detection, interval statistics, etc.)
			newMode.c = modes[i].c;

			// Store transposed version of each note
			newMode.n = [];
			for (let j = 0; j < SCALE; ++j) {
				newMode.n.push( modes[i].n[ (j - key + 24) % SCALE ] );
			}

			newList.push(newMode);

		}
	}
	return newList;
}

var getAllSimilarityPairs = (modes, settings, numTop) => {
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

	// Sort interactions by score
	pairs = pairs.sort((a, b) => { return a.score < b.score; } );
	const filterDiv = 1.0 / numTop;

	return pairs;

}

// Classical modes and a few common variations for quick testing
var getDebugModes = () => {
	return [
		createMode("Vader Theme", 3,				"#  #   ##  #"),
	];
}

// Classical modes and a few common variations for quick testing
var getMedievalModes = () => {
	return [
		createMode("Ionian", 1,					"# # ## # # #"),
		createMode("Lydian", 1, 				"# # # ## # #"),
		createMode("Mixolydian", 1,				"# # ## # ## "),
		createMode("Aeolian", 1,				"# ## # ## # "),
		createMode("Dorian", 1,					"# ## # # ## "),
		createMode("Phrygian", 1,				"## # # ## # "),
		createMode("Locrian", 1,				"## # ##  # #"),
		createMode("Harmonic Minor", 1,			"# ## # ##  #"),
		createMode("Melodic Minor", 1,			"# ## # # # #"),
		createMode("Harmonic Major", 1,			"# # ## ##  #"),
	];
}

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

	// Add input scale as a mode
	modes.push(exa);

	// Run the algorithm
	let pairs = getAllSimilarityPairs(modes, settings, 10);
	// Filter by score
	pairs = pairs.filter(pair => pair.score >= edgeCutoff);

	// Return results
	return { 'pairs': pairs, 'modes': modes };
}

// Types: 0 = user, 1 = classical/medieval mode, 2 = other mode, 3 = chord(s)
var createGraphNode = (name, group, type, svgWidth, svgHeight) => {
    return {
        "id": name,
        "group": group,
        "type": type,
        "fixed": "TRUE",
        "x": Math.random() * svgWidth,
        "y": Math.random() * svgHeight,
    };
}

// Returns JSON of graph info (nodes and edges)
var convertAnalysisToGraph = (modes, pairs, depth, svgWidth, svgHeight, settings) => {
	let g = {};
	g.nodes = [];
	g.links = [];
	g.modeDict = {};

	const layer = [
        {maxNodes:                  Math.ceil(0.65 * settings.filterResultMax),
        cutoffToAdd:                0.0,
        edgeAlpha:                  1.0,
        interconnectionCutoff:      0.25,
        interconnectionAlpha:       0.6},

        {maxNodes:                  Math.ceil(0.35 * settings.filterResultMax),
        cutoffToAdd:                0.25,
        edgeAlpha:                  0.45,
        interconnectionCutoff:      0.30,
        interconnectionAlpha:       0.35}
	];

	// Count connections to user modes
	let haveNum = 1;
	for (let i = 0; i < pairs.length; ++i) {
		if (pairs[i].a.isUser || pairs[i].b.isUser) {
			if (pairs[i].score >= layer[0].cutoffToAdd) {
				haveNum++;
			}
		}
	}

	// Determine steps needed for filtering
	let buckets = 1;
	let useThisLayer = layer[0].maxNodes;

    // Define buckets
	let bucketData = [];
	buckets = (haveNum > useThisLayer) ? 10 : 1;

	// Create buckets
	for (let i = 0; i < 10; ++i) {
		bucketData.push([]);
	}

	// Fill buckets
    for (let i = 0; i < pairs.length; ++i) {
        if (pairs[i].a.isUser || pairs[i].b.isUser) {
            if (pairs[i].score >= layer[0].cutoffToAdd) {
                const bucket = parseInt(Math.max(0, 10 - Math.ceil(pairs[i].score * 10)));
                bucketData[bucket].push(pairs[i]);
            }
        }
    }

	let usedNodes = new Set();
    let connectors = new Set();
	let connectorsNext = new Set();

	// Add user modes
	for (let i = 0; i < modes.length; ++i) {
        if (modes[i].isUser) {
            g.nodes.push(createGraphNode(modes[i].name, 0, 0, svgWidth, svgHeight));
            g.modeDict[modes[i].name] = modes[i];

            usedNodes.add(modes[i].name);
            connectors.add(modes[i].name);
        }
	}

	// Add level 1

    // Buckets:
    // 1st run = 1 of each
    // 2nd
	let b = 0;
	for (let i = 0; i < useThisLayer; ++i) {
		console.log(i + " out of " + useThisLayer);
		let b1 = b;

		// Prioritize better buckets
		let useB = 0;
		if (b1 < 5)
			useB = 0;
		else if (b1 < 9)
			useB = 1;
		else if (b1 < 13)
			useB = 2;
		else if (b1 < 16)
			useB = 3;
		else if (b1 < 18)
			useB = 4;
		else if (b1 < 20)
			useB = 5;
		else
			useB = (b1 - 20) + 6;
		if (useB >= 10)
			useB = 0;

		let iter = 0;
		while (bucketData[useB].length == 0 && iter < 100) {
			// Choose random bucket
			useB = parseInt(Math.floor(Math.random() * 10));
			iter++;
		}
		if (iter >= 100) {
			console.log("ERROR: Bucket overflow");
			break;
		}

		let bucketItem = 0;
		if (i == 0) {
			// First choice is always top...
			bucketItem = 0;
		} else {
			bucketItem = parseInt(Math.floor(Math.random() * bucketData[useB].length));
		}

		// Get item
		const nameA = bucketData[useB][bucketItem].a.name;
		const typeA = bucketData[useB][bucketItem].a.type;
		const nameB = bucketData[useB][bucketItem].b.name;
		const typeB = bucketData[useB][bucketItem].b.type;
		const score = bucketData[useB][bucketItem].score;

		if (!usedNodes.has(nameA)) {
			g.nodes.push(createGraphNode(nameA, 1, typeA, svgWidth, svgHeight));
			g.modeDict[nameA] = bucketData[useB][bucketItem].a;

			usedNodes.add(nameA);
			connectorsNext.add(nameA);
		}
		if (!usedNodes.has(nameB)) {
			g.nodes.push(createGraphNode(nameB, 1, typeB, svgWidth, svgHeight));
			g.modeDict[nameB] = bucketData[useB][bucketItem].b;

			usedNodes.add(nameB);
			connectorsNext.add(nameB);
		}

		// EDGES
		// {"source": "Napoleon", "target": "Myriel", "value": 1}

		g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': layer[0].edgeAlpha});

		// Remove from bucket
		bucketData[useB].splice(bucketItem, 1);

		b = (b + 1) % 23;
	}

    // Add level 1 edges
	for (let i = 0; i < pairs.length; ++i) {
		const nameA = pairs[i].a.name;
		const nameB = pairs[i].b.name;
		if (connectorsNext.has(nameA) && connectorsNext.has(nameB))
		{
			const score = pairs[i].score;
			if (score >= layer[0].interconnectionCutoff) {
				g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': layer[0].interconnectionAlpha});
			}
		}
	}

	// Add level 2
	connectors = new Set();
	let bucket = [];
	for (let i = 0; i < pairs.length; ++i) {
		const nameA = pairs[i].a.name;
		const nameB = pairs[i].b.name;
		// Ensure at least one node is new, and one node is in previous level
		if (usedNodes.has(nameA) != usedNodes.has(nameB) && (connectorsNext.has(nameA) || connectorsNext.has(nameB)))
		{
			const score = pairs[i].score;
            if (score >= layer[1].cutoffToAdd) {
                bucket.push(pairs[i]);
			}
		}
	}

	// Empty bucket
	for (let i = 0; i < layer[1].maxNodes; ++i) {
        if (bucket.length <= 0)
            break;
        // Choose randomly from bucket
        let bucketItem = Math.floor(Math.random() * bucket.length);

        const nameA = bucket[bucketItem].a.name;
        const typeA = bucket[bucketItem].a.type;
		const nameB = bucket[bucketItem].b.name;
		const typeB = bucket[bucketItem].b.type;
		const score = bucket[bucketItem].score;

		if (!usedNodes.has(nameA)) {
            g.nodes.push(createGraphNode(nameA, 2, typeA, svgWidth, svgHeight));
            g.modeDict[nameA] = bucket[bucketItem].a;

            usedNodes.add(nameA);
            connectors.add(nameA);
        }
        if (!usedNodes.has(nameB)) {
            g.nodes.push(createGraphNode(nameB, 2, typeB, svgWidth, svgHeight));
            g.modeDict[nameB] = bucket[bucketItem].b;

            usedNodes.add(nameB);
            connectors.add(nameB);
        }
        g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': layer[1].edgeAlpha});

        // Remove from bucket
		bucket.splice(bucketItem, 1);
	}

	// Add level 2 edges
	for (let i = 0; i < pairs.length; ++i) {
		const nameA = pairs[i].a.name;
		const nameB = pairs[i].b.name;
		if (connectors.has(nameA) && connectors.has(nameB))
		{
			const score = pairs[i].score;
			if (score >= layer[1].interconnectionCutoff) {
				g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': layer[1].interconnectionAlpha});
			}
		}
	}

	// Sort links
	g.links.sort(function(a, b) {
        return a.value > b.value;
    });

	return g;
}




