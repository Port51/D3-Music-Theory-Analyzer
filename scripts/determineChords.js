"use strict";

/*
    Finds common chords within a given mode
*/

// Returns a list of chord names that work with this mode
var determineChordsInMode = (mode) => {
    let chords = [];
    for (let a = 0; a < mode.c.length; ++a) {
        // Start from root and move upwards
        // So we don't have to sort afterwards
        const i = (mode.key + a) % mode.c.length;

        if (mode.n[i]) {
            // Add all chords for this note
            chords.push.apply(chords, determineChordsForNote(i, mode.n));
        }
    }
    return chords;
}

// Returns a list of chord names starting with this note
// EX: Am, Adim, Am+
var determineChordsForNote = (i, n) => {
    // These are intervals
    // Negative intervals => need to NOT have those notes
    const req = [
        "", [4, 7],
        "+", [4, 8],
        "lyd", [4, 6],

        "m", [3, 7],
        "m+", [3, 8],
        "dim", [3, 6],

        "(5)", [-3, -4, 7],
        "(b5)", [-3, -4, 6],
        "(#5)", [-3, -4, 8],
        "(m3)", [3, -6, -7],
        "(M3)", [4, -6, -7],
    ];

    const noteName = getNoteName(i);
    let chords = [];

    for (let c = 0; c < req.length / 2; ++c) {
        let allow = true;
        for (let r = 0; r < req[c * 2 + 1].length; ++r) {
            const interval = req[c * 2 + 1][r];
            if (interval > 0) {
                // Need this interval
                const id = (i + interval) % n.length;
                if (!n[id]) {
                    allow = false;
                    break;
                }
            } else {
                // Not to NOT have this interval
                const id = (i - interval) % n.length;
                if (n[id]) {
                    allow = false;
                    break;
                }
            }

        }

        if (allow) {
            chords.push(noteName + req[c * 2 + 0]);
        }
    }
    chords.push('NL');

    return chords;

}

