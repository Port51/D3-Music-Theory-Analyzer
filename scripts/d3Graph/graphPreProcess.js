"use strict";

var convertAnalysisToGraph = (modes, pairs, depth, graphInfo) => {
	const edgeOpacities = [1.0, 0.8, 0.55, 0.45];

	let g = {};
	g.nodes = [];
	g.links = [];
	g.modeDict = {};
	g.modeImpact = {};
	g.usedNodes = new Set();
	g.edgeCount = {};

	// Sort each layer by score
	pairs.layer0_1 = pairs.layer0_1.sort((a, b) => { return a.score < b.score; } );
	pairs.layer1 = pairs.layer1.sort((a, b) => { return a.score < b.score; } );
	pairs.layer1_2 = pairs.layer1_2.sort((a, b) => { return a.score < b.score; } );
	pairs.layer2 = pairs.layer2.sort((a, b) => { return a.score < b.score; } );

	// Add user modes
	for (let i = 0; i < modes.length; ++i) {
		if (modes[i].isUser) {
			g.nodes.push(createGraphNode(modes[i].name, 0, 0, 1.0, 1.0, graphInfo.svgWidth, graphInfo.svgHeight));
			g.modeDict[modes[i].name] = modes[i];
			g.usedNodes.add(i);

		}
		
	}

	const debugSmallTest = false;
	const nodeLimit = debugSmallTest ? 1000 : graphInfo.settings.displayNumResults;
	const splitRatio = 0.7;

	// Layer 1: Top 80% connected to user mode
	const tryForNum = Math.ceil(splitRatio * nodeLimit);
	g = addNodesInBatch(g, modes, pairs.layer0_1, tryForNum, 1, edgeOpacities[0], graphInfo);

	const interconnections1 = pairs.layer1.filter((p) => { return (g.usedNodes.has(p.a) && g.usedNodes.has(p.b)); });
	g = addEdgesInBatch(g, modes, interconnections1, 1, edgeOpacities[1], graphInfo);
	
	// Layer 2: Other modes
	const tryForNum2 = nodeLimit - tryForNum;
	const filteredLayer2 = pairs.layer1_2.filter((p) => { return (g.usedNodes.has(p.a) || g.usedNodes.has(p.b)); });
	g = addNodesInBatch(g, modes, filteredLayer2, tryForNum2, 2, edgeOpacities[2], graphInfo);

	const interconnections2 = pairs.layer2.filter((p) => { return (g.usedNodes.has(p.a) && g.usedNodes.has(p.b)); });
	g = addEdgesInBatch(g, modes, interconnections2, 1, edgeOpacities[3], graphInfo);

	// Final processing
	g = normalizeEdgeWeights(g);

	// Sort links for better draw order
	g.links.sort(function(a, b) { return a.value > b.value; });

	return g;
}

var normalizeEdgeWeights = (g) => {
	g.links = g.links.map((e) => {
		// Get edge count
		const edges = Math.min(g.edgeCount[e.source], g.edgeCount[e.target]);

		e.edgeStrMult = 1.0;
		e.edgeDistMult = 1.0;

		if (edges != null) {
			if (edges == 1) {
				e.edgeStrMult = 1.0;
				e.edgeDistMult = 1.0;
			}
			else {
				//e.edgeStrMult = 1.0;
				//e.edgeDistMult = 1.0;
			}
		}

		return e;
	});

	return g;

}

var convertAnalysisToGraph2 = (modes, pairs, depth, graphInfo) => {
	let g = {};
	g.nodes = [];
	g.links = [];
	g.modeDict = {};
	g.modeImpact = {};
	g.usedNodes = new Set();
	g.edgeCount = {};

	// Sort by score
	pairs = pairs.sort((a, b) => { return a.score < b.score; } );

	// Add user modes
	for (let i = 0; i < modes.length; ++i) {
		if (modes[i].isUser) {
			g.nodes.push(createGraphNode(modes[i].name, 0, 0, 1.0, 1.5, graphInfo.svgWidth, graphInfo.svgHeight));
			g.modeDict[modes[i].name] = modes[i];
			g.usedNodes.add(i);
			g.touchedNodes.add(i);

		}
		
	}

	// Layer 1: Top 80% connected to user mode
	const tryForNum = Math.ceil(0.8 * 20);
	const nearUsers = pairs.filter((p) => {
		return (modes[p.a].isUser !== modes[p.b].isUser);
	});
	g = addNodesInBatch(g, modes, nearUsers, tryForNum, 1, graphInfo);

	const interconnections1 = pairs.filter((p) => {
		return (!modes[p.a].isUser && !modes[p.b].isUser && g.usedNodes.has(p.a) && g.usedNodes.has(p.b));
	});
	g = addEdgesInBatch(g, modes, interconnections1, 1, graphInfo);

	// Layer 2: Other modes
	const tryForNum2 = 50 - tryForNum;
	const nearGraph = pairs.filter((p) => {
		return (g.usedNodes.has(p.a) !== g.usedNodes.has(p.b) && (!g.touchedNodes.has(p.a) || !g.touchedNodes.has(p.b)));
	});
	g = addNodesInBatch(g, modes, nearGraph, tryForNum2, 2, graphInfo);

	return g;
}

var addNodesInBatch = (g, modes, pairsToAdd, numToAdd, layerID, layerAlpha, graphInfo) => {
	for (let i = 0; i < pairsToAdd.length; ++i) {
		// Get item data
		const indexA = pairsToAdd[i].a;
		const indexB = pairsToAdd[i].b;

		if (i < numToAdd || numToAdd < 0) {
			const modeA = modes[indexA];
			const modeB = modes[indexB];
			const nameA = modeA.name;
			const typeA = modeA.type;
			const nameB = modeB.name;
			const typeB = modeB.type;
			const score = pairsToAdd[i].score;

			// Add nodes
			if (!g.usedNodes.has(indexA)) {
				// Determine impact (related to user mode)
				let impact = 1.0;
				if (layerID == 1) {
					impact = 0.4 + 0.6 * score;
				} else if (layerID == 2) {
					// Get impact of parent node
					impact = (0.6 * score + 0.4 * g.modeImpact[nameB]) * 0.5;
				}
				if (impact == null) impact = 0.5;
				else if (impact < 0.0) impact = 0.0;
				else if (impact > 1.0) impact = 1.0;

				g.nodes.push(createGraphNode(nameA, layerID, typeA, 1.0, impact, graphInfo.svgWidth, graphInfo.svgHeight));
				g.modeDict[nameA] = modeA;
				g.modeImpact[nameA] = impact;
				g.usedNodes.add(indexA);
				g.edgeCount[nameA] = 0;

			}

			if (!g.usedNodes.has(indexB)) {
				// Determine impact (related to user mode)
				let impact = 1.0;
				if (layerID == 1) {
					impact = 0.4 + 0.6 * score;
				} else if (layerID == 2) {
					// Get impact of parent node
					impact = (0.6 * score + 0.4 * g.modeImpact[nameA]) * 0.5;
				}
				if (impact == null) impact = 0.5;
				else if (impact < 0.0) impact = 0.0;
				else if (impact > 1.0) impact = 1.0;

				g.nodes.push(createGraphNode(nameB, layerID, typeB, 1.0, impact, graphInfo.svgWidth, graphInfo.svgHeight));
				g.modeDict[nameB] = modeB;
				g.modeImpact[nameB] = impact;
				g.usedNodes.add(indexB);
				g.edgeCount[nameB] = 0;

			}

			// Add edge
			g.links.push({ source: nameA, target: nameB, value: score, weight: score, 'alpha': layerAlpha });

			// Add to edge counts
			g.edgeCount[nameA]++;
			g.edgeCount[nameB]++;

		}
	}
	
	return g;
}

var addEdgesInBatch = (g, modes, pairsToAdd, layerID, layerAlpha, graphInfo) => {
	for (let i = 0; i < pairsToAdd.length; ++i) {
		// Get item data
		const indexA = pairsToAdd[i].a;
		const indexB = pairsToAdd[i].b;
		const nameA = modes[indexA].name;
		const nameB = modes[indexB].name;
		const score = pairsToAdd[i].score;

		// Add edge
		g.links.push({ source: nameA, target: nameB, value: score, weight: score, 'alpha': layerAlpha });

	}
	
	return g;
}

// Returns JSON of graph info (nodes and edges)
var convertAnalysisToGraph2 = (modes, pairs, depth, svgWidth, svgHeight, settings) => {
	let g = {};
	g.nodes = [];
	g.links = [];
	g.modeDict = {};
	let usedNodes = new Set();

	// Define layers of graph, originating with user scale
	const layer = [
		{maxNodes:                  Math.ceil(0.65 * settings.filterResultMax),
		cutoffToAdd:                0.1,
		edgeAlpha:                  1.0,
		interconnectionCutoff:      0.25,
		interconnectionAlpha:       0.6},

		{maxNodes:                  Math.ceil(0.35 * settings.filterResultMax),
		cutoffToAdd:                0.25,
		edgeAlpha:                  0.45,
		interconnectionCutoff:      0.30,
		interconnectionAlpha:       0.35}
	];

	// Sort interactions by score
	pairs = pairs.sort((a, b) => { return a.score < b.score; } );

	// Add user modes
	for (let i = 0; i < modes.length; ++i) {
		if (modes[i].isUser) {
			g.nodes.push(createGraphNode(modes[i].name, 0, 0, 1.0, svgWidth, svgHeight));
			g.modeDict[modes[i].name] = modes[i];
			usedNodes.add(modes[i].name);
		}
	}

	// Add layer 1
	let newLayer = addGraphLayer( g, modes, pairs, usedNodes, usedNodes, layer[0], 1, svgWidth, svgHeight );
	g = newLayer.g;
	usedNodes = newLayer.usedNodes;

	// Add layer 2
	newLayer = addGraphLayer( g, modes, pairs, usedNodes, usedNodes, layer[1], 2, svgWidth, svgHeight );
	g = newLayer.g;
	usedNodes = newLayer.usedNodes;
	
	// Sort links for better draw order
	g.links.sort(function(a, b) { return a.value > b.value; });

	console.log(g);

	return g;
}

var addGraphLayer = (g, modes, pairs, connectors, usedNodes, layerInfo, layerID, svgWidth, svgHeight) => {
	
	// Get pairs connected to connectors (will still be sorted by max connection)
	const nextLevel = findConnectedPairs(modes, pairs, connectors, usedNodes, layerInfo.cutoffToAdd);
	console.log(nextLevel);
	const nextLevelPairs = nextLevel.pairs;
	const nextLevelBuckets = nextLevel.buckets;

	// Filter using bucket indices
	const filteredPairs = (nextLevelPairs.length > 0) ? addFilteredPairs(nextLevelPairs, nextLevelBuckets, layerInfo.maxNodes) : [];
	
	// Add those pairs
	let newestLayer = new Set();
	for (let i = 0; i < filteredPairs.length; ++i) {
		// Get item data
		const modeA = modes[filteredPairs[i].a];
		const modeB = modes[filteredPairs[i].b];
		const nameA = modeA.name;
		const typeA = modeA.type;
		const nameB = modeB.name;
		const typeB = modeB.type;
		const score = filteredPairs[i].score;

		// Add any new nodes
		if (!usedNodes.has(nameA)) {
			g.nodes.push(createGraphNode(nameA, layerID, typeA, 1.0, svgWidth, svgHeight));
			g.modeDict[nameA] = filteredPairs[i].a;
			if (filteredPairs[i].a == null) {
				console.log("ERROR: Could not add " + nameA + " to mode dictionary!");
			}
			
			usedNodes.add(nameA);
			newestLayer.add(nameA);
		}
		if (!usedNodes.has(nameB)) {
			g.nodes.push(createGraphNode(nameB, layerID, typeB, 1.0, svgWidth, svgHeight));
			g.modeDict[nameB] = filteredPairs[i].b;
			if (filteredPairs[i].b == null) {
				console.log("ERROR: Could not add " + nameA + " to mode dictionary!");
			}

			usedNodes.add(nameB);
			newestLayer.add(nameB);
		}

		// Add edge
		g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': layerInfo.edgeAlpha});

	}

	// Add edges between those new nodes
	for (let i = 0; i < pairs.length; ++i) {
		const nameA = modes[pairs[i].a].name;
		const nameB = modes[pairs[i].b].name;

		if (newestLayer.has(nameA) && newestLayer.has(nameB))
		{
			const score = pairs[i].score;
			if (score >= layerInfo.interconnectionCutoff) {
				g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': layerInfo.interconnectionAlpha});
			}
		}
	}

	// Add all connected (and unfiltered) pairs to list of used nodes,
	// so they aren't searched again
	/*for (let i = 0; i < nextLevelPairs.length; ++i) {
		const nameA = nextLevelPairs[i].a.name;
		const nameB = nextLevelPairs[i].b.name;
		usedNodes.add(nameA);
		usedNodes.add(nameB);
	}*/

	return { 'g': g, 'usedNodes': usedNodes }
}

// Returns pairs that have at least 1 member in connectors
var findConnectedPairs = (modes, pairs, connectors, usedNodes, cutoffToAdd) => {
	let connectedPairs = [];
	let buckets = [0];
	let nextBucketCutoff = 0.9;
	let itemsAdded = 0;
	for (let i = 0; i < pairs.length; ++i) {
		const modeA = modes[pairs[i].a];
		const modeB = modes[pairs[i].b];

		// Check connections
		if (connectors.has(modeA.name) || connectors.has(modeB.name)) {
			// Ensure at least 1 new node
			if (!usedNodes.has(modeA.name) || !usedNodes.has(modeB.name)) {

				// Adjusted score accounts for the cutoff so that score that are barely above
				// the cutoff are close to 0.0
				const adjustedScore = (pairs[i].score - cutoffToAdd) / (1.0 - cutoffToAdd);
				if (adjustedScore >= cutoffToAdd) {
					// Add item
					connectedPairs.push(pairs[i]);
					itemsAdded++;

					// Check if need to add bucket indices
					while (adjustedScore < nextBucketCutoff) {
						// Add bucket index and lower threshold for next bucket
						buckets.push(itemsAdded - 1);
						nextBucketCutoff -= 0.1;
					}
				}
			}
		}
	}

	// Always need 10 buckets
	// for later calculations to work
	while (buckets.length < 10) {
		buckets.push(pairs.length);
	}

	return { pairs: connectedPairs, 'buckets': buckets }

}

