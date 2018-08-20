"use strict";

var getIntervals = (a) => {
	// Create list of intervals
	let intervals = new Array(a.c.length).fill(0);

	let lastNote = -1;
	for (let i = 0; i < a.c.length; ++i) {
		if (a.c[i]) {
			if (lastNote > 0) {
				// Log interval
				const iSize = i - lastNote;
				intervals[iSize]++;
			}
			// Track last note for next interval
			lastNote = i;
		}
	}

	return intervals;
}

// How happy is the song
var getMoodTone = (a) => {
	let sadHappy = 0.5;
	let bittersweet = 0.0;

	if (a.c[1] && !a.c[2])
		sadHappy -= 0.1;

	// 3rd
	if (a.c[3] && a.c[4])
		sadHappy -= 0.15; // both! sounds a bit unhappy
	else if (a.c[3])
		sadHappy -= 0.55;
	else if (a.c[4])
		sadHappy += 0.55;

	// 6th
	if (a.c[8] && !a.c[9])
		sadHappy -= 0.2;
	else if (!a.c[8] && a.c[9])
		sadHappy += 0.2;

	// Any #4 stuff going on?
	if (a.c[5] && a.c[6] && a.c[7])
		sadHappy -= 0.05; // blues stuff...
	if (a.c[6] && !a.c[7])
		sadHappy -= 0.4; // diminished!
	else if (a.c[6] && !a.c[7])
		sadHappy -= 0.2; // lydian

	// Bittersweet from conflicts
	if (a.c[3] && a.c[11])
		bittersweet += 0.25;
	if (a.c[3] && a.c[8])
		bittersweet += 0.25;
	if (a.c[4] && a.c[7])
		bittersweet += 0.25;
	if (a.c[3] && a.c[4])
		bittersweet += 0.25;
	// But bluesy runs make it less bittersweet
	if (a.c[5] && a.c[6] && a.c[7])
		bittersweet -= 0.25;
	if (a.c[8] && a.c[9])
		bittersweet -= 0.25;
	if (a.c[10] && a.c[11])
		bittersweet -= 0.25;

	if (sadHappy < 0.0) sadHappy = 0.0;
	if (sadHappy > 1.0) sadHappy = 1.0;
	if (bittersweet < 0.0) bittersweet = 0.0;
	if (bittersweet > 1.0) bittersweet = 1.0;

	return {'sadHappy': sadHappy, 'bittersweet': bittersweet};
}

var getMoodStatic = (a) => {
	// Sliding scales
	let motion = 0.5,
		happySad = 0.5;
		
	// Special properties 0-1
	let aggression = 0.0;
	let wonkiness = 0.0;
	let definition = 1.0;
	if (a.c[1]) aggression += 0.1;
	if (a.c[6]) aggression += 0.5;
	if (a.c[8]) aggression += 0.5;
	if (a.c[10]) aggression += 0.1;

	// Root
	if (!a.c[0])
		definition -= 0.9;
	
	// 2nds
	if (a.c[1] && a.c[2]) {
		// b2 + 2
		wonkiness += 0.25;
	} else if (a.c[1]) {
		// b2
		motion += 0.25;
	} else if (a.c[2]) {
		// 2
		
	} else {
		// none
		definition -= 0.333;
	}
	
	// 3rds
	if (a.c[3] && a.c[4]) {
		// b3 + 3
		motion += 0.2;
		happySad -= 0.333;
	} else if (a.c[3]) {
		// b3
		happySad -= 0.5;
	} else if (a.c[4]) {
		// 3
		happySad += 0.5;
	} else {
		// none
		definition -= 0.75;
	}
	
	// 4th + 5th
	if (a.c[5] && a.c[6] && a.c[7]) {
		// 4 b5 5
		wonkiness += 0.25;
	} else if (a.c[5] && !a.c[6] && a.c[7]) {
		// standard 4 5
		wonkiness -= 0.25;
	} else if (!a.c[5] && a.c[6] && a.c[7]) {
		// lydian
		motion += 0.2;
		happySad -= 0.2;
	} else if (a.c[5] && a.c[6] && !a.c[7]) {
		// 4 b5
		happySad -= 0.2;
		
	} else if (a.c[5]) {
		// just 4
		definition -= 0.75;
	} else if (a.c[6]) {
		// just b5
		happySad -= 0.2;
	} else if (a.c[7]) {
		// just 5
		definition -= 0.6;
	} else {
		// none
		definition -= 1.0;
	}
	
	// 6th
	if (a.c[3] && a.c[4]) {
		// b6 + 6
		wonkiness += 0.5;
	} else if (a.c[3]) {
		// b6
		happySad += 0.125;
	} else if (a.c[4]) {
		// 6
		happySad -= 0.125;
	} else {
		// none
		definition -= 0.25;
	}
	
	// 7th
	if (a.c[3] && a.c[4]) {
		// b7 + 7
		wonkiness += 0.4;
	} else if (a.c[3]) {
		// b7
		
	} else if (a.c[4]) {
		// 7
		
	} else {
		// none
		motion -= 0.25;
		definition -= 0.25;
	}

	if (happySad < 0.0) happySad = 0.0;
	if (happySad > 1.0) happySad = 1.0;
	if (motion < 0.0) motion = 0.0;
	if (motion > 1.0) motion = 1.0;
	if (definition < 0.0) definition = 0.0;
	if (definition > 1.0) definition = 1.0;
	if (wonkiness < 0.0) wonkiness = 0.0;
	if (wonkiness > 1.0) wonkiness = 1.0;
	if (aggression < 0.0) aggression = 0.0;
	if (aggression > 1.0) aggression = 1.0;

	return { 'happySad': happySad, 'motion': motion, 'definition': definition, 'wonkiness': wonkiness, 'aggression': aggression };
	
}

var getMoodSimilarity_Tone = (a, b) => {
	const msA = getMoodTone(a);
	const msB = getMoodTone(b);
	if (a.name == "C Aeolian")
		console.log(msA.sadHappy)
	if (a.isUser)
		console.log("USER " + msA.sadHappy)

	let simSadHappy = 1.0 - Math.abs(msB.sadHappy - msA.sadHappy) / 0.6;
	if (simSadHappy < 0.0) simSadHappy = 0.0;
	let simBittersweet = 1.0 - Math.abs(msB.bittersweet - msA.bittersweet) / 0.6;
	if (simBittersweet < 0.0) simBittersweet = 0.0;

	// Power factor
	simSadHappy = Math.pow(simSadHappy, 3.0);
	simBittersweet = Math.pow(simBittersweet, 3.0);
	
	let score = simSadHappy * 1.0 + 0.0 * simBittersweet;

	if (score < 0.0) score = 0.0;
	if (score > 1.0) score = 1.0;

	return score;
}

var getMoodSimilarity_Simple = (a, b) => {
	let score = 1.0;
	
	const msA = getMoodStatic(a);
	const msB = getMoodStatic(b);
	
	// Compare differences in traits
	const traits = ['happySad', 'motion', 'definition', 'wonkiness', 'aggression'];
	const traitCurve = [0, 0, 0, 1, 1];
	const traitWeight = [3, 2, 1, 1, 2];
	let diff = 0.0;
	for (let i = 0; i < traits.length; ++i) {
		let traitName = traits[i];
		if (traitCurve[i] == 0) {
			// Matters if above/below 0.5
			// Use V curve w/ 0.5 at edges, 1.0 in center
			const avg = (msA[traitName] + msB[traitName]) * 0.5 - 0.5;
			diff += Math.abs(msA[traitName] - msB[traitName]) * (1.0 - Math.abs(avg)) * traitWeight[i];
		} else {
			// Simple difference
			diff += Math.abs(msA[traitName] - msB[traitName]) * traitWeight[i];
		}
	}
	score = 1.0 / (1.0 + Math.pow(diff, 3.0));

	// Apply stretch cutoff
	const stretchCutoff = 0.1;
	score = Math.max(0.0, score - stretchCutoff) / (1.0 - stretchCutoff);

	if (score < 0.0) score = 0.0;
	if (score > 1.0) score = 1.0;
	
	return score;
}

var varianceI = (arr) => {
	let total = 0.0;
	for (let i = 0; i < arr.length; ++i) {
		total += arr[i] * i * i; // value is squared
	}
	if (arr.length > 0)
		return total / arr.length;
	else
		return 0.0;
}

var getMoodSimilarity_Intervals = (a, b) => {
	const msA = getIntervals(a);
	const msB = getIntervals(b);

	const varDiff = Math.abs(varianceI(msA) - varianceI(msB));

	// Count similarities
	let numSame = 0,
		numDiff = 0;
	for (let i = 0; i < a.c.length; ++i) {
		const countA = msA[i];
		const countB = msB[i];
		const same = countA < countB ? countA : countB; // min
		const diff = Math.abs(countB - countA);
		numSame += same;
		numDiff += diff;
	}

	return {same: numSame, different: numDiff, varianceDiff: varDiff};

}





