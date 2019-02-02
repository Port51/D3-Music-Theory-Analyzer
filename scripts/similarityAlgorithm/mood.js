"use strict";

// Namespace pattern
var SCORES = SCORES || {};


// How happy is the song
SCORES.getMoodTone = (a) => {
	let sadHappy = 0.5;
	let bittersweet = 0.0;

	if (a.c[1] && !a.c[2]) {
		sadHappy -= 0.1;
	}

	// 3rd
	if (a.c[3] && a.c[4]) {
		sadHappy -= 0.15; // both! sounds a bit unhappy
	}
	else if (a.c[3]) {
		sadHappy -= 0.55;
	}
	else if (a.c[4]) {
		sadHappy += 0.55;
	}

	// 6th
	if (a.c[8] && !a.c[9]) {
		sadHappy -= 0.2;
	}
	else if (!a.c[8] && a.c[9]) {
		sadHappy += 0.2;
	}

	// Any #4 stuff going on?
	if (a.c[5] && a.c[6] && a.c[7]) {
		sadHappy -= 0.05; // blues stuff...
	}
	if (a.c[6] && !a.c[7]) {
		sadHappy -= 0.4; // diminished!
	}
	else if (a.c[6] && !a.c[7]) {
		sadHappy -= 0.2; // lydian
	}

	// Bittersweetness comes from conflicts
	if (a.c[3] && a.c[11]) {
		bittersweet += 0.25;
	}
	if (a.c[3] && a.c[9]) {
		bittersweet += 0.25;
	}
    if (a.c[4] && a.c[1]) {
		bittersweet += 0.25;
	}
	if (a.c[4] && a.c[8]) {
		bittersweet += 0.25;
	}
    if (a.c[4] && a.c[6]) {
		bittersweet += 0.25;
	}
	if (a.c[3] && a.c[4]) {
		bittersweet += 0.40; // extra!
	}

	// Bluesy runs make it less bittersweet
	if (a.c[5] && a.c[6] && a.c[7]) {
		bittersweet -= 0.3333;
	}
	if (a.c[8] && a.c[9]) {
		bittersweet -= 0.3333;
	}
	if (a.c[10] && a.c[11]) {
		bittersweet -= 0.3333;
	}

	return { 'sadHappy': saturate(sadHappy), 'bittersweet': saturate(bittersweet) };
}

SCORES.getMoodSimilarity_Tone = (a, b) => {
	const msA = SCORES.getMoodTone(a);
	const msB = SCORES.getMoodTone(b);

	let simSadHappy = 1.0 - Math.abs(msB.sadHappy - msA.sadHappy) / 0.6;
	let simBittersweet = 1.0 - Math.abs(msB.bittersweet - msA.bittersweet) / 0.6;

	// Power factor
	simSadHappy = Math.pow(simSadHappy, 3.0);
	simBittersweet = Math.pow(simBittersweet, 3.0);

	return { 'simHappy': saturate(simSadHappy), 'simBittersweet': saturate(simBittersweet) };
}

