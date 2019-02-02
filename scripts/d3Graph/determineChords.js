"use strict";

/*
	Finds common chords within a given mode
*/

var getChordAnalysis = (mode) => {
	const res = determineChordsInMode(mode);
	const chords = res.chords;
	const chordsByTonic = res.chordsByTonic;
	const chordInfoByTonic = res.chordInfoByTonic;

	console.log("Found following chords:");
	console.log(chords);

	// Analyze cadences
	let cadences = [];
	if (mode.key != null) {
		const tonicChord = chords.find((x) => { return x.tonic === mode.key; } )
		if (tonicChord != null) {
			for (let i = 0; i < chordInfoByTonic.length; ++i) {
				if (chordInfoByTonic[i].length > 0) {
					if (chordInfoByTonic[i][0].tonic !== mode.key) {
						// Try every chord type resolving to tonic
						for (let j = 0; j < chordInfoByTonic[i].length; ++j) {
							const testChord = chordInfoByTonic[i][j];
							if (testChord != null) {

								const score = getChordResolutionScore(testChord, tonicChord);

								if (score > 0.0) {
									cadences.push({ 'label': (testChord.label + " -> " + tonicChord.label), 'score': score });
								}
							}

						}

					}
				}
				
			}
		}

		// Choose best cadences
		cadences.sort((a, b) => { return a.score < b.score; });
		if (cadences.length > 8) {
			cadences = cadences.slice(0, 8);
		}
		cadences = cadences.map((x) => { return x.label; })

	}
	

	return { 'chords': chords, 'chordsByTonic': chordsByTonic, 'cadences': cadences };
}

// Returns a list of chord names that work with this mode
var determineChordsInMode = (mode) => {
	let chords = [];
	let chordInfoByTonic = [];
	let chordsByTonic = [];
	//console.log(mode.c);

	for (let i = 0; i < mode.c.length; ++i) {
		// Start from root and move upwards
		// So we don't have to sort afterwards
		const tonic = (mode.key + i) % mode.c.length;

		if (mode.c[i]) {
			// Add all chords for this note
			const newChords = determineChordsForNote(tonic, mode.n);

			if (newChords.length > 0) {
				// Push info for later analysis
				chords.push.apply(chords, newChords);
				chordInfoByTonic.push(newChords);
				// Just push names for display
				chordsByTonic.push(newChords.map((x) => { return x.label; }));
			}

		}
	}

	return { 'chords': chords, 'chordsByTonic': chordsByTonic, 'chordInfoByTonic': chordInfoByTonic };
}

// Returns a list of chord names starting with this note
// EX: Am, Adim, Am+
var determineChordsForNote = (tonic, n) => {
	// These are intervals
	// Negative intervals => need to NOT have those notes
	
	const keyName = getNoteName(tonic);
	const possibleChords = [
		{ label: keyName + "", type: "M", seventh: "", req: [4, 7] },
		{ label: keyName + "7", type: "M", seventh: "m", req: [4, 7, 10] },
		{ label: keyName + "(maj7)", type: "M", seventh: "M", req: [4, 7, 11] },
		{ label: keyName + "(lyd)", type: "lyd", seventh: "", req: [4, 6] },
		{ label: keyName + "(lyd 7)", type: "lyd", seventh: "m", req: [4, 6, 10] },
		{ label: keyName + "(lyd maj7)", type: "lyd", seventh: "M", req: [4, 6, 11] },
		{ label: keyName + "m", type: "m", seventh: "", req: [3, 7] },
		{ label: keyName + "m7", type: "m", seventh: "m", req: [3, 7, 10] },
		{ label: keyName + "m(maj7)", type: "m", seventh: "M", req: [3, 7, 11] },
		{ label: keyName + "dim", type: "dim", seventh: "", req: [3, 6] },
		{ label: keyName + "dim7", type: "dim", seventh: "m", req: [3, 6, 10] },
		{ label: keyName + "dim(maj7)", type: "dim", seventh: "M", req: [3, 6, 11] },
	]

	const noteName = getNoteName(tonic);
	let chords = [];

	for (let c = 0; c < possibleChords.length; ++c) {
		const chord = possibleChords[c];
		const req = chord.req;

		let allow = true;
		for (let r = 0; r < req.length; ++r) {
			const interval = req[r];
			
			// Need this interval
			const id = (tonic + interval) % n.length;
			if (!n[id]) {
				allow = false;
				break;
			}

		}

		if (allow) {
			// Fill out all notes
			chord.n = n.map((x, xi) => {
				if (xi === tonic)
					return true;

				for (let r = 0; r < req.length; ++r) {
					if ((tonic + req[r]) % 12 === xi) {
						return true;
					}
				}

				return false;
			});
			chord.tonic = tonic;

			chords.push(chord);
		}

	}

	return chords;

}

// Each chord = { tonic: 0-11, type: string, seventh: "m/M/-", n: [] }
// Returns score in [0.0, 1.0] range
var getChordResolutionScore = (a, b) => {
	// Diminished chords mostly pull to I chord above them
	// Handle them as a special case
	if (a.type === "dim") {
		if (b.type === "M" && b.tonic === (a.tonic + 1) % 12) {
			if (a.seventh === "m") {
				return 1.0;
			} else if (a.seventh === "M") {
				return 0.0;
			} else {
				return 0.8;
			}
		} else {
			return 0.0;
		}
	}

	// Is characteristic included?
	const hasCharacteristic = a.n[b.tonic];

	// Is non-tonic chord major?
	const isMajor = (a.type === "M");

	// Count # of notes pulling to tonic chord
	let notesPulling = 0;
	for (let i = 0; i < b.n.length; ++i) {
		if (b.n[i]) {
			// Look for half step above and below
			// ONLY if this note is not included in A chord
			// (The F in Fmaj7 doesn't pull to E very much)
			if (!a.n[i]) {
				// Count only once
				if (a.n[(i - 1) % 12]) {
					notesPulling++;
				}
				else if (a.n[(i + 1) % 12]) {
					notesPulling++;
				}
			}

		}
	}
	const notePullScore = Math.pow(Math.min(1.0, notesPulling / 4.0), 0.25);

	// Root proximity (from perspective of root chord)
	const rootProximity = (a.tonic - b.tonic + 12) % 12;
	let rootProximityScore = 0.0;
	switch (rootProximity) {
		case 1:
		case 7:
		case 11:
			rootProximityScore = 1.0;
			break;
		case 2:
		case 5:
		case 10:
			rootProximityScore = 0.5;
			break;
		default:
			rootProximityScore = 0.0;
	}

	// How much does chord A want to resolve?
	let tensionScore = 0.0;
	switch (a.seventh) {
		case "m":
			tensionScore += 0.9;
			break;
		case "M":
			tensionScore += 0.4;
			break;
		default:
	}
	if (a.type === "lyd") {
		tensionScore += 0.8;
	}
	if (tensionScore > 1.0) {
		tensionScore = 1.0;
	}

	//console.log(a);
	//console.log(isMajor + " " + hasCharacteristic + " " + notePullScore + " " + rootProximityScore + " " + tensionScore);

	const score =
		(0.334 * ((isMajor) ? 1.0 : 0.0) +
		0.333 * ((hasCharacteristic) ? 1.0 : 0.0) +
		0.333 * notePullScore) *
			(0.8 + 0.2 * rootProximityScore) *
			(0.8 + 0.2 * tensionScore);

	return score;
}

