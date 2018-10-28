

// INPUT: a = original mode, b = mode moving to
// OUTPUT: Format { shared, different, densityChange }
var getCompromises = (a, b) => {
	
	let numShared = 0,
		numAgreedZero = 0,
		extraA = 0,
		extraB = 0,
		numA = 0
		;
		
	for (let i = 0; i < a.n.length; ++i)
	{
		if (a.n[i] && b.n[i]) {
			numShared++;
			numA++;
		}
		else if (a.n[i] && !b.n[i]) {
			extraA++;
			numA++;
		}
		else if (!a.n[i] && b.n[i]) {
			extraB++;
		}
		else
			numAgreedZero++;
	}
	
	// Take minimum, as most differences are notes moving
	let actualDifferent = extraA < extraB ? extraA : extraB;
	
	return { numNotesA: numA, shared: numShared, different: actualDifferent, densityChange: (extraB - extraA) };
}

var getCompromiseScore = (a, b) => {
	const comp = getCompromises(a, b);
	const debugThis = (a.isUser && b.name === "C Ionian" && 1 == 2) ? true : false;
	
	let noteSimScore = 0.0;
	let addScore = 1.0;
	let remScore = 1.0;
	const cutoffShared = 0.5; // point at which totally different
	if (comp.shared > 0 && cutoffShared * comp.shared > (comp.different)) {
		if (debugThis)
			console.log(1.0 - (comp.different) / (cutoffShared * comp.shared));
		noteSimScore = Math.pow(1.0 - (comp.different) / (cutoffShared * comp.shared), 3.0);

		// Subtract for extra notes based on settings
		if (comp.densityChange > 0) {
			addScore = 1.0 / (1.0 + comp.densityChange * comp.densityChange); // 0.5, 0.2, 0.1, etc.
		} else {
			remScore = 1.0 / (1.0 + comp.densityChange * comp.densityChange);
		}

	}

	if (addScore < 0.0) addScore = 0.0;
	if (remScore < 0.0) remScore = 0.0;

	if (debugThis) {
		console.log(comp.numNotesA);
		console.log(comp.shared);
		console.log(comp.different);
		console.log(comp.densityChange);
		console.log(noteSimScore);
	}

	return {noteSim: noteSimScore, add: addScore, rem: remScore};
}


