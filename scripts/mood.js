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

	// Bittersweetness comes from conflicts
	if (a.c[3] && a.c[11])
		bittersweet += 0.25;
	if (a.c[3] && a.c[9])
		bittersweet += 0.25;
    if (a.c[4] && a.c[1])
		bittersweet += 0.25;
	if (a.c[4] && a.c[8])
		bittersweet += 0.25;
    if (a.c[4] && a.c[6])
		bittersweet += 0.25;
	if (a.c[3] && a.c[4])
		bittersweet += 0.40; // extra!

	// Bluesy runs make it less bittersweet
	if (a.c[5] && a.c[6] && a.c[7])
		bittersweet -= 0.3333;
	if (a.c[8] && a.c[9])
		bittersweet -= 0.3333;
	if (a.c[10] && a.c[11])
		bittersweet -= 0.3333;

	if (sadHappy < 0.0) sadHappy = 0.0;
	if (sadHappy > 1.0) sadHappy = 1.0;
	if (bittersweet < 0.0) bittersweet = 0.0;
	if (bittersweet > 1.0) bittersweet = 1.0;

	return {'sadHappy': sadHappy, 'bittersweet': bittersweet};
}

var getMoodSimilarity_Tone = (a, b) => {
	const msA = getMoodTone(a);
	const msB = getMoodTone(b);

	let simSadHappy = 1.0 - Math.abs(msB.sadHappy - msA.sadHappy) / 0.6;
	if (simSadHappy < 0.0) simSadHappy = 0.0;
	let simBittersweet = 1.0 - Math.abs(msB.bittersweet - msA.bittersweet) / 0.6;
	if (simBittersweet < 0.0) simBittersweet = 0.0;

	// Power factor
	simSadHappy = Math.pow(simSadHappy, 3.0);
	simBittersweet = Math.pow(simBittersweet, 3.0);

	if (simSadHappy < 0.0) simSadHappy = 0.0;
	if (simSadHappy > 1.0) simSadHappy = 1.0;
	if (simBittersweet < 0.0) simBittersweet = 0.0;
	if (simBittersweet > 1.0) simBittersweet = 1.0;

	return {'simHappy': simSadHappy, 'simBittersweet': simBittersweet};
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





