"use strict";

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

