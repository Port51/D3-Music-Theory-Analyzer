"use strict";

const SCALE = 12;

var print = (mode) => {
	let display = "",
		num = 0;
	for (let i = 0; i < SCALE; ++i) {
		if (mode.n[i]) {
			if (i == mode.key)
				display += "@";
			else
				display += "#";
			num++;
		}
		else {
			if (i == mode.key)
				display += ".";
			else
				display += " ";
		}
	}
	return '[' + display + '] (' + num + ') ' + mode.name;
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

var createMode = (name, arr) => {
	let mode = {};
	mode.label = name;
	mode.isUser = false;
	mode.key = 0;
	mode.name = GetNoteName(mode.key) + ' ' + mode.label;
	mode.n = [];
	for (let i = 0; i < SCALE; ++i) {
		if (arr[i] == 0)
			mode.n.push(false);
		else
			mode.n.push(true);
	}
	mode.c = mode.n;
	
	return mode;
}

var randomMode = () => {
	let mode = {};
	mode.label = Math.random().toString(26).substr(2, 5);
	mode.isUser = false;
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

var score2 = (a, b) => {
	let matches = 0;
	let conflicts = 0;
	let neutrals = 0;
	
	// Distributions of differences
	let m_diff = [];
	let c_diff = [];
	
	// Simple priority difference
	let diffScore = 0.0;
	for (let i = 0; i < SCALE; ++i) {
		let iScore = 0.0;
		const p1 = a.n[i];
		const p2 = b.n[i];
		const d = Math.abs(p2 - p1);
		
		if (p1 === 0 && p2 === 0) {
			neutrals++;
		} else if (p1 > 0 && p2 > 0) {
			matches++;
			m_diff.push(d / 5.0);
		} else {
			conflicts++;
			c_diff.push(d / 5.0);
		}
	}
	
	if (matches == 0)
		return 0.0;
	if (matches == 7) // exclude boring matches
		return 0.0;
	
	if (matches > 0) {
		var m_diff_avg = 1.0 / (1.0 + avg(m_diff));
		var m_diff_var = 1.0 / (1.0 + variance(m_diff));
	}
	
	if (conflicts > 0) {
		var c_diff_avg = avg(c_diff);
		var c_diff_var = variance(c_diff);
	}
	
	let total = (matches + neutrals) / SCALE;
	//console.log("match avg = " + m_diff_avg + " var = " + m_diff_var + ", conflict avg = " + c_diff_avg + " var = " + c_diff_var);
	
	let adjScore = total * m_diff_var;
	if (conflicts > 0) {
		adjScore -= (conflicts * c_diff_var) * (conflicts * 0.5);
	}
	//console.log("adjSCORE = " + adjScore);
	return adjScore;
}

var score3 = (a, b) => {
	let ret = 0.0;
	
	// Simple priority difference
	let diffScore = 0.0;
	for (let i = 0; i < SCALE; ++i) {
		let iScore = 0.0;
		const p1 = a.n[i];
		const p2 = b.n[i];
		const d = Math.abs(p2 - p1);
		
		if (d === 0) {
			// Agreement!
			
			// Add to score if note
			if (p1 != 0)
				iScore += 1.0;
			else
				iScore += 1.0;
			
		} else {
			// Disagreement!
			if (p1 == 0 || p2 == 0) {
				// Really bad... missing note
				iScore -= 1.0;
				//iScore -= (1.0 + 1.0 * Math.pow(p1 + p2, 3.0));
			} else {
				// Just disagreement about how strong notes are
				// Not a big deal
				if (d == 1)
					iScore += 0.95;
				else if (d == 2)
					iScore += 0.9;
				else if (d == 3)
					iScore += 0.6;
				else
					iScore += 0.33;
				
			}
		}
		
		diffScore += iScore / SCALE;
	}
	
	// Find nested dissonance
	let nestDissPenalty = 0.0;
	for (let i = 0; i < SCALE; ++i) {
		let dPenalty = 0.0;
		const p1 = a.n[i];
		const p2 = b.n[i];
		
		if ((p1 == 0 && p2 != 0) || (p1 != 0 && p2 == 0)) {
			// See if nested
			let arr = [];
			if (p1 == 0) arr = a.n;
			else arr = b.n;
			
			// Search surrounding array
			if (arr[(i - 1) % SCALE] != 0 && arr[(i + 1) % SCALE] != 0) {
				// Nested dissonance!
				dPenalty = 1.0;
			}
			
		}
		
		nestDissPenalty -= dPenalty / SCALE;
	}
	
	// Calculate score
	let total = diffScore * 1.0;
	
	// Subtract penalties (scaled by effect of how bad ONE penalty would be)
	total -= nestDissPenalty * 0.0;
	
	return Math.min(Math.max(total, -1.0), 1.0);
}


var useAllKeys = (modes) => {
	let newList = [];
	for (let i = 0; i < modes.length; ++i) {
		
		let useKeys = SCALE;
		if (modes[i].isUser)
			useKeys = 1;
		else if (modes[i].label === "Whole Tone Scale")
			useKeys = 2;
		else if (modes[i].label === "Chromatic")
			useKeys = 1;
		
		for (let key = 0; key < useKeys; ++key) {
			let newMode = {};
			newMode.label = modes[i].label;
			newMode.isUser = modes[i].isUser;
			newMode.key = key;
			newMode.name = GetNoteName(newMode.key) + ' ' + newMode.label;
			newMode.n = [];
			newMode.c = modes[i].c;
			
			// Shift all notes
			for (let j = 0; j < SCALE; ++j) {
				newMode.n.push( modes[i].n[ (j - key + 24) % SCALE ] );
			}
			
			newList.push(newMode);
			
		}
	}
	return newList;
}

var runTest = (modes, settings, numTop) => {
	modes = useAllKeys(modes);
	
	const M = modes.length;

	// Compare all combinations
	let pair = [];
	let scores = [];
	let zeroScores = 0;
	for (let i = 0; i < M - 1; ++i) {
		for (let j = i + 1; j < M; ++j) {
			// Only compare from C
			if (modes[i].key == 0 || 1 == 1)
			{
				const s1 = score(modes[i], modes[j], settings);
				const s2 = score(modes[j], modes[i], settings);

				let s = 0.0;
				if (modes[i].isUser && modes[j].isUser ||
					!modes[i].isUser && !modes[j].isUser)
						s = avgScores(s1, s2);
				else if (modes[i].isUser)
					s = s1;
				else
					s = s2;
				
				pair.push( { a: modes[i], b: modes[j], score: s } );
				scores.push(s.score);
				if (s.score <= 0.0)
					zeroScores++;
			}
		}
	}
	
	console.log("COMPLETED! Calulated " + pair.length.toString() + " scores");
	console.log("   Avg = " + (Math.round(avg(scores) * 100) / 100).toString() + ", zero scores: " + Math.round(100 * zeroScores / pair.length).toString() + "%");

	pair = pair.sort((a, b) => { return a.score.score < b.score.score; } );
	const filterDiv = 1.0 / numTop;
	let i = 0;
	let printed = 0;
	while (i < pair.length && printed < numTop)
	{
		const needScore = 1.0 - printed * filterDiv;

		if ((pair[i].a.isUser || pair[i].b.isUser) && pair[i].score.score <= needScore) {
			console.log(" ");
			console.log(print(pair[i].a));
			console.log(print(pair[i].b));
			console.log("SCORE = " + Math.round(pair[i].score.score * 100) / 100 + "       note similarity = " + Math.round(pair[i].score.comp * 100) / 100 + ", root score = " + Math.round(pair[i].score.root * 100) / 100 + ", mood similarity = " + Math.round(pair[i].score.mood * 100) / 100 );
			++printed;
		}
		++i;
	}

	return pair;
	
}

var GetModes = () => {
	let m = [];
	/*									 			 C     D     E  F     G     A     B		 */
	m.push(createMode("Ionian",						[5, 0, 2, 0, 4, 2, 0, 4, 0, 2, 0, 3]));
	m.push(createMode("Lydian",						[5, 0, 2, 0, 4, 0, 4, 4, 0, 2, 0, 3]));
	m.push(createMode("Mixolydian",					[5, 0, 2, 0, 4, 2, 0, 4, 0, 2, 4, 0]));
	m.push(createMode("Aeolian",					[5, 0, 2, 4, 0, 2, 0, 4, 2, 0, 3, 0]));
	m.push(createMode("Dorian",						[5, 0, 2, 4, 0, 2, 0, 4, 0, 4, 3, 0]));
	m.push(createMode("Phrygian",					[5, 4, 0, 2, 0, 2, 0, 2, 2, 0, 3, 0]));
	m.push(createMode("Locrian",					[5, 4, 0, 2, 0, 1, 3, 0, 2, 0, 3, 0]));

	return m;

	m.push(createMode("Harmonic Minor",				[5, 0, 2, 4, 0, 2, 0, 4, 2, 0, 0, 4]));
	m.push(createMode("Melodic Minor",				[5, 0, 2, 4, 0, 2, 0, 4, 0, 4, 0, 4]));
	m.push(createMode("Dorian #4",					[5, 0, 2, 4, 0, 0, 4, 4, 0, 4, 3, 0]));
	m.push(createMode("Lydian #9",					[5, 0, 0, 4, 4, 0, 4, 3, 0, 2, 0, 3]));

	/*												 C     D     E  F     G     A     B		 */
	m.push(createMode("Harmonic Major",				[5, 0, 2, 0, 4, 2, 0, 4, 4, 0, 0, 3]));
	m.push(createMode("Double Harmonic Major",		[5, 3, 0, 0, 4, 3, 0, 4, 3, 0, 0, 3]));
	m.push(createMode("Whole Tone Scale",			[3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0]));
	m.push(createMode("Chromatic",					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]));
	m.push(createMode("Altered Scale",				[5, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0]));
	m.push(createMode("Blues",						[5, 0, 2, 4, 0, 3, 4, 4, 0, 0, 3, 0]));
	/*												 C     D     E  F     G     A     B		 */
	m.push(createMode("Enigmatic",					[5, 3, 0, 0, 4, 0, 3, 0, 3, 0, 3, 3]));
	m.push(createMode("Flamenco",					[5, 3, 0, 0, 4, 2, 0, 3, 3, 0, 0, 3]));
	m.push(createMode("Gypsy",						[5, 0, 2, 4, 0, 0, 3, 3, 3, 0, 3, 0]));
	m.push(createMode("Half Diminished",			[5, 0, 2, 4, 0, 0, 3, 0, 3, 0, 3, 0]));
	/*												 C     D     E  F     G     A     B		 */
	m.push(createMode("Hirajoshi",					[5, 0, 0, 0, 4, 0, 4, 4, 0, 0, 0, 3]));
	
	// CHORD PAIRS
	/*												 C     D     E  F     G     A     B		 */
	m.push(createMode("Antagonism",					[5, 3, 0, 3, 0, 0, 5, 3, 0, 3, 0, 0]));
	m.push(createMode("Vader Theme",				[5, 0, 0, 3, 0, 0, 0, 3, 5, 0, 0, 3]));
	
	return m;
}


var runAnalysis = (edgeCutoff, settings, exa) => {
	let modes = [];

	// Construct modes
	const datasetID = settings.datasetID;
	const killClones = false;
	if (datasetID == 0)
		modes = GetModes();
	else if (datasetID == 1)
		modes = getTempData();
	else if (datasetID == 2) {
		const M = 30;
		for (let i = 0; i < M; ++i) {
			modes.push(randomMode());
		}
		killClones = true;
	}

	// Add user scale as a mode
	modes.push(exa);

	// Run the algorithm
	let data = runTest(modes, settings, 10);

	// Return data
	return { 'data': data, 'modes': modes };
}

// Data = pairs
var convertAnalysisToGraph = (modes, data, depth, edgeCutoff, settings) => {
	let g = {};
	g.nodes = [];
	g.links = [];

	// Determine steps needed for filtering
	let data_1 = [];
	for (let i = 0; i < 10; ++i) {
		// Fill buchets
		data_1.push([]);
	}

	let allowNum = settings.filterResultMax;
	let haveNum = 1;
	for (let i = 0; i < data.length; ++i) {
		if (data[i].a.isUser || data[i].b.isUser) {
			if (data[i].score.score >= edgeCutoff) {
				const bucket = parseInt(Math.ceil((data[i].score.score - edgeCutoff) / (1.0 - edgeCutoff)));
				data_1[bucket].push(data[i]);
				haveNum++;
			}
		}
	}
	let filterRatio = allowNum / haveNum * 0.8; // 80% for this level
	console.log(haveNum);

	// Filter tracking
	let fCountIncl = 0;
	let fCountTotal = 0;


	let usedNodes = new Set();
	// Add user scale
	const userScale = modes[modes.length - 1].name;
	g.nodes.push({"id": userScale, "group": 0});
	usedNodes.add(userScale);

	// Add level 1
	let cutoff = 0.0;
	let alpha = 1.0;
	let connectors = new Set();
	let connectorsNext = new Set();
	connectors.add(userScale);

	let insertNum = allowNum * 0.8;
	if (haveNum < insertNum)
		insertNum = haveNum;

	let b = 0;
	for (let i = 0; i < allowNum; ++i) {
		console.log(i + " out of " + allowNum);
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
		while (data_1[useB].length == 0 && iter < 100) {
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
			bucketItem = parseInt(Math.floor(Math.random() * data_1[useB].length));
		}

		// Get item
		const nameA = data_1[useB][bucketItem].a.name;
		const nameB = data_1[useB][bucketItem].b.name;
		const score = data_1[useB][bucketItem].score.score;

		// Set initial positions because D3 doesn't
		if (!usedNodes.has(nameA)) {
			g.nodes.push({"id": nameA, "group": 1, "fixed": "TRUE", "transform": "translate(250, 250)"});
			usedNodes.add(nameA);
		}
		if (!usedNodes.has(nameB)) {
			g.nodes.push({"id": nameB, "group": 1, "fixed": "TRUE", "transform": "translate(250, 250)"});
			usedNodes.add(nameB);
		}

		// EDGES
		// {"source": "Napoleon", "target": "Myriel", "value": 1}

		g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': alpha});

		// Set up as next link
		if (!connectors.has(nameA))
			connectorsNext.add(nameA);
		if (!connectors.has(nameB))
			connectorsNext.add(nameB);

		// Remove from bucket
		data_1[useB].splice(bucketItem, 1);

		b = (b + 1) % 23;
	}

	return g;

	/*for (let i = 0; i < data.length; ++i) {
		const nameA = data[i].a.name;
		const nameB = data[i].b.name;
		if (connectors.has(nameA) || connectors.has(nameB))
		{
			const score = data[i].score.score;
			if (score >= edgeCutoff) {
				// FILTER STEP
				let include = false;
				if (fCountTotal == 0)
					include = true;
				else {
					// Closer to ratio if include vs. not?
					const d1 = Math.abs((fCountIncl + 1) / (fCountTotal + 1) - filterRatio);
					const d2 = Math.abs(fCountIncl / (fCountTotal + 1) - filterRatio);
					include = d1 <= d2 ? true : false;
				}

				if (include) {
					// NODES
					// {"id": "Mme.Hucheloup", "group": 8}
					if (!usedNodes.has(nameA)) {
						g.nodes.push({"id": nameA, "group": 1});
						usedNodes.add(nameA);
					}
					if (!usedNodes.has(nameB)) {
						g.nodes.push({"id": nameB, "group": 1});
						usedNodes.add(nameB);
					}

					// EDGES
					// {"source": "Napoleon", "target": "Myriel", "value": 1}

					g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': alpha});

					// Set up as next link
					if (!connectors.has(nameA))
						connectorsNext.add(nameA);
					if (!connectors.has(nameB))
						connectorsNext.add(nameB);

					fCountIncl++;
				}
				fCountTotal++;
			}
		}
	}*/
	//return g;

	// Add level 1 interconnections
	cutoff = 0.2;
	alpha = 0.5;
	for (let i = 0; i < data.length; ++i) {
		const nameA = data[i].a.name;
		const nameB = data[i].b.name;
		if (connectorsNext.has(nameA) && connectorsNext.has(nameB))
		{
			const score = data[i].score.score;
			if (score >= cutoff) {
				// NODES
				// {"id": "Mme.Hucheloup", "group": 8}
				if (!usedNodes.has(nameA)) {
					g.nodes.push({"id": nameA, "group": 0});
					usedNodes.add(nameA);
				}
				if (!usedNodes.has(nameB)) {
					g.nodes.push({"id": nameB, "group": 0});
					usedNodes.add(nameB);
				}

				if (score >= edgeCutoff) {
					// EDGES
					// {"source": "Napoleon", "target": "Myriel", "value": 1}

					g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': alpha});
				}

				// Set up as next link
				if (!connectors.has(nameA))
					connectorsNext.add(nameA);
				if (!connectors.has(nameB))
					connectorsNext.add(nameB);
			}
		}
	}

	// Add level 2
	/*
	let connectors = new Set();
	for (let i = 0; i < data.length; ++i) {
		const nameA = data[i].a.name;
		const nameB = data[i].b.name;
		if (connectorsNext.has(nameA) || connectorsNext.has(nameB))
		{
			const score = data[i].score.score;

			// NODES
			// {"id": "Mme.Hucheloup", "group": 8}
			if (!usedNodes.has(nameA)) {
				g.nodes.push({"id": "2" + nameA, "group": 0});
				usedNodes.add(nameA);
			}
			if (!usedNodes.has(nameB)) {
				g.nodes.push({"id": "2" + nameB, "group": 0});
				usedNodes.add(nameB);
			}

			if (score >= edgeCutoff) {
				// EDGES
				// {"source": "Napoleon", "target": "Myriel", "value": 1}

				g.links.push({source: nameA, target: nameB, value: score, weight: score});
			}
		}
	}
	*/

	return g;
}

// Data = pairs
var convertToGraph_All = (data, edgeCutoff) => {
	let g = {};
	g.nodes = [];
	g.links = [];

	let usedNodes = new Set();
	for (let i = 0; i < data.length; ++i) {
		const nameA = data[i].a.name;
		const nameB = data[i].b.name;
		const score = data[i].score.score;

		// NODES
		// {"id": "Mme.Hucheloup", "group": 8}
		if (!usedNodes.has(nameA)) {
			g.nodes.push({"id": nameA, "group": 0});
			usedNodes.add(nameA);
		}
		if (!usedNodes.has(nameB)) {
			g.nodes.push({"id": nameB, "group": 0});
			usedNodes.add(nameB);
		}

		if (score >= edgeCutoff) {
			// EDGES
			// {"source": "Napoleon", "target": "Myriel", "value": 1}

			g.links.push({source: nameA, target: nameB, value: score, weight: score});
		}
	}
	return g;
}

/*
// Notice there is no 'import' statement. 'tf' is available on the index-page
// because of the script tag above.

// Define a model for linear regression.
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// Prepare the model for training: Specify the loss and the optimizer.
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// Generate some synthetic data for training.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// Train the model using the data.
model.fit(xs, ys, {epochs: 10}).then(() => {
	// Use the model to do inference on a data point the model hasn't seen before:
	// Open the browser devtools to see the output
	model.predict(tf.tensor2d([5], [1, 1])).print();
});
*/







