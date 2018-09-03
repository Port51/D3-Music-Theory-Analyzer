"use strict";

// Returns JSON of graph info (nodes and edges)
var convertAnalysisToGraph = (modes, pairs, depth, svgWidth, svgHeight, settings) => {
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
			g.nodes.push(createGraphNode(modes[i].name, 0, 0, svgWidth, svgHeight));
			g.modeDict[modes[i].name] = modes[i];
			usedNodes.add(modes[i].name);
		}
	}

	// Add layer 1
	let newLayer = addGraphLayer( g, pairs, usedNodes, usedNodes, layer[0], 1, svgWidth, svgHeight );
	g = newLayer.g;
	usedNodes = newLayer.usedNodes;

	// Add layer 2
	newLayer = addGraphLayer( g, pairs, usedNodes, usedNodes, layer[1], 2, svgWidth, svgHeight );
	g = newLayer.g;
	usedNodes = newLayer.usedNodes;

	

	// Sort links
	g.links.sort(function(a, b) {
		return a.value > b.value;
	});

	return g;
}

var addGraphLayer = (g, pairs, connectors, usedNodes, layerInfo, layerID, svgWidth, svgHeight) => {
	
	// Get pairs connected to connectors (will still be sorted by max connection)
	const nextLevel = findConnectedPairs(pairs, connectors, usedNodes, layerInfo.cutoffToAdd);
	const nextLevelPairs = nextLevel.pairs;
	const nextLevelBuckets = nextLevel.buckets;

	// Filter using bucket indices
	const filteredPairs = (nextLevelPairs.length > 0) ? addFilteredPairs(nextLevelPairs, nextLevelBuckets, layerInfo.maxNodes) : [];
	
	// Add those pairs
	let newestLayer = new Set();
	for (let i = 0; i < filteredPairs.length; ++i) {
		// Get item data
		const nameA = filteredPairs[i].a.name;
		const typeA = filteredPairs[i].a.type;
		const nameB = filteredPairs[i].b.name;
		const typeB = filteredPairs[i].b.type;
		const score = filteredPairs[i].score;

		// Add any new nodes
		if (!usedNodes.has(nameA)) {
			g.nodes.push(createGraphNode(nameA, layerID, typeA, svgWidth, svgHeight));
			g.modeDict[nameA] = filteredPairs[i].a;
			
			usedNodes.add(nameA);
			newestLayer.add(nameA);
		}
		if (!usedNodes.has(nameB)) {
			g.nodes.push(createGraphNode(nameB, layerID, typeB, svgWidth, svgHeight));
			g.modeDict[nameB] = filteredPairs[i].b;

			usedNodes.add(nameB);
			newestLayer.add(nameB);
		}

		// Add edge
		g.links.push({source: nameA, target: nameB, value: score, weight: score, 'alpha': layerInfo.edgeAlpha});
	}

	// Add edges between those new nodes
	for (let i = 0; i < pairs.length; ++i) {
		const nameA = pairs[i].a.name;
		const nameB = pairs[i].b.name;

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
var findConnectedPairs = (pairs, connectors, usedNodes, cutoffToAdd) => {
	let connectedPairs = [];
	let buckets = [0];
	let nextBucketCutoff = 0.9;
	let itemsAdded = 0;
	for (let i = 0; i < pairs.length; ++i) {
		// Check connections
		if (connectors.has(pairs[i].a.name) || connectors.has(pairs[i].b.name)) {
			// Ensure at least 1 new node
			if (!usedNodes.has(pairs[i].a.name) || !usedNodes.has(pairs[i].b.name)) {

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

