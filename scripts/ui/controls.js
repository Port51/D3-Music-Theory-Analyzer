
// Shared data
// Set defaults here
var rootSel = 7; // default to key of G minor (no 2nd)
var keySel =		    [true, false, true, true, false, true, false, true, false, false, true, false];
var keySelVis =		    [false, false, false, false, false, false, false, false, false, false, false, false];
var mouseOverKey = -1;
var keyMouseOverVis =	[false, false, false, false, false, false, false, false, false, false, false, false];
var modeDict = {};
var allowD3Physics = true;
var allowD3Sticky = true;


var validateInput = (v) => {
	v = parseFloat(v);
	switch (true) {
		case (v == null):
			return 0.0;
		case (v < 0):
			return 0.0;
		case (v > 100):
			return 1.0;
		default:
			return (v / 100.0);
	}
}

var getSelectedDatasets = () => {
	return [
		document.getElementById("chk_incl_0").checked,
		document.getElementById("chk_incl_1").checked,
		document.getElementById("chk_incl_2").checked,
		document.getElementById("chk_incl_3").checked,
		document.getElementById("chk_incl_4").checked,
		document.getElementById("chk_incl_5").checked,
		document.getElementById("chk_incl_6").checked,
		document.getElementById("chk_incl_7").checked,
		document.getElementById("chk_incl_8").checked,
		document.getElementById("chk_incl_9").checked,
		document.getElementById("chk_incl_10").checked,
	];
}

// Create settings
var createSettings = (datasets) => {
	const weightFactors = {
		"allowMoreNotes": 1.0 - validateInput(document.getElementById("allowMoreNotes").value),
		"allowDifferentRoots": validateInput(document.getElementById("allowDifferentRoots").value),
		"moodEstimation": validateInput(document.getElementById("estimateMood").value),
	};

	return {
		"datasets":  			getSelectedDatasets(),
		"weightFactors": 		weightFactors,
		"displayNumResults": 	Math.ceil(3 + 20 * validateInput(document.getElementById("displayNumResults").value)),
	}

}

// Create mode based on notes selected by user
var createUserMode = () => {
	const key = rootSel;
	const label = "New Scale";
	let mode = {
		"label": label,
		"isUser": true,
		"type": 0,
		"key": key,
		"name": getNoteName(key) + ' ' + label,
		"n": [],
		"c": [],
		"aliases": [],
	};
	for (let i = 0; i < 12; ++i) {
		mode.n.push(keySel[i]);
	}

	// Un-transpose to static version
	for (let i = 0; i < 12; ++i) {
		mode.c.push(mode.n[(i + mode.key) % 12]);
	}

	return mode;
}

var setAllowD3Physics = (v) => {
	allowD3Physics = v;
}

var setAllowD3Sticky = (v) => {
	allowD3Sticky = v;
	if (!allowD3Sticky) {
		// Unstick all nodes
		node.each(function(d) {
			d.fx = null;
			d.fy = null;
		});
		simulation.alphaTarget(0.3).restart();
	}
}

var setModalActive = (id, active) => {
	console.log("Show modal window #" + id);
	const modal = document.getElementById("modal-" + id.toString());

	if (id == 0) {
		// Ensure correct key highlights
		setKeyColors();
	}

	if (active) {
		modal.style['display'] = 'block';
	} else {
		modal.style['display'] = 'none';
	}
}

// Unselect all notes
var buttonResetScale = () => {
	console.log("buttonResetScale");
	rootSel = 0;
	for (let i = 0; i < 12; ++i) {
		keySel[i] = false;
	}
	setKeyColors();
	setRootSelectColors();
}

var buttonCancelPianoSelect = () => {
	// Close modal window
	setModalActive(0, false);
}

var buttonCancelSettings = () => {
	// Close modal window
	setModalActive(1, false);
}

var buttonCloseInstructions = () => {
	// Close modal window
	setModalActive(2, false);
}

var clickRootSelect = (event) => {
	const note = event.data.note;
	if (rootSel === note) {
		// Turn off!
		//rootSel = null;
	} else {
		// Turn on!
		rootSel = note;
	}

	setRootSelectColors();
}

var clickKey = (event) => {
	const note = event.data.note;
	//alert("Key press id = " + note);
	if (note >= 0 && note < keySel.length) {
		keySel[note] = !keySel[note];
		if (keySel[note] == null) {
			keySel[note] = false;
		}
	}

	setKeyColors();
}

var hoverKeyOn = function() {
	mouseOverKey = parseInt($(this).attr('value'));
	setKeyColors();
}

var hoverKeyOff = function() {
	if (mouseOverKey === parseInt($(this).attr('value'))) {
		mouseOverKey = -1;
	}
	setKeyColors();
}

var resetAnimation = (elem, animName) => {
	elem.each(function() {
		// Remove previous animations
		$(this).removeClass("jitterKey").removeClass("jitterKeySlow");
		// Add new animation
		$(this).width($(this).width()).addClass(animName);
	});

}

// Update colors for root selection
var setRootSelectColors = () => {
	for (let i = 0; i < 12; ++i) {
		$('.rootSelect[value="' + i + '"]').find("span").attr('value', (rootSel === i));
	}
}

// Update colors for keys that have changed
var setKeyColors = () => {
	for (let i = 0; i < 12; ++i) {
		if (keySel[i] == null) {
			keySel[i] = false;
		}
		if (keySelVis[i] != keySel[i]) {
			let color = '';
			if (keySel[i])
				color = '#3355ee';
			else if (i === 1 || i === 3 || i === 6 || i === 8 || i === 10)
				color = '#222222';
			else
				color = '#cccccc';

			// Change color
			if (keySel[i]) {
				$(".pianoKey[value=" + i + "]").attr('highlight', 'true');
				// Trigger selected animation
				resetAnimation($('.pianoKey[value="' + i + '"]'), "jitterKey");
			}
			else {
				$(".pianoKey[value=" + i + "]").attr('highlight', 'false');
				// Trigger unselected animation
				resetAnimation($('.pianoKey[value="' + i + '"]'), "jitterKeySlow");
			}

			// Remember
			keySelVis[i] = keySel[i];
		}

		// Mouseover
		const wMouseOver = (mouseOverKey === i) ? true : false;
		if (keyMouseOverVis[i] != wMouseOver) {
			keyMouseOverVis[i] = wMouseOver;
			$(".pianoKey[value=" + i + "]").attr('mouseover', keyMouseOverVis[i]);
		}

	}
}

var buttonRunFromPiano = () => {
	console.log("Button click: buttonRunFromPiano");

	const settings = createSettings();

	// Check for any notes selected
	let numNotes = 0;
	for (let i = 0; i < 12; ++i) {
		if (keySel[i]) {
			numNotes++;
		}
	}

	// Check for any data sources selected
	let numDataSources = 0;
	for (let i = 0; i < 12; ++i) {
		if (settings.datasets[i]) {
			numDataSources++;
		}
	}

	// Check if root is in scale
	const rootIncluded = keySel[rootSel];

	// Check with user to see if weird inputs are intended
	let validInput = true;
	if (numNotes == 0) {
		validInput = confirm("You haven't selected any notes. Are you sure you want to continue?");
	} else if (!rootIncluded) {
		validInput = confirm("Your root (yellow circle) is not included in the scale. Are you sure you want to continue?");
	} else if (numDataSources == 0) {
		validInput = confirm("You haven't selected any data sources. Are you sure you want to continue?");
	}

	if (validInput) {
		// Close modal window
		setModalActive(0, false);

		// Run analysis
		ALGO.runSimulation(settings);
	}

}

var setInstructionsInputFunctions = () => {
	$("#closeInstructions").click(buttonCloseInstructions);
}

var setSliderInputFunctions = () => {
	$("#cancelSettings").click(buttonCancelSettings);
	$("#setSlidersZero").click(slidersZero);
	$("#setSlidersMid").click(slidersMid);
	$("#setSlidersDefault").click(slidersDefault);
	$("#setSlidersFull").click(slidersFull);
}

var setPianoInputFunctions = () => {
	$(".pianoKey").each(function() {
		$(this).click({ note: parseInt($(this).attr('value')) }, clickKey);
	});
	$(".pianoKey").hover(hoverKeyOn, hoverKeyOff);
	$(".rootSelect").each(function() {
		$(this).click({ note: parseInt($(this).attr('value')) }, clickRootSelect);
	});

	// Special handling
	$("body").on('click', '#resetScale', buttonResetScale);
	$("body").on('click', '#runFromPiano', buttonRunFromPiano);
	$("body").on('click', '#cancelNoteSelect', buttonCancelPianoSelect);

	// Select text on focus
	$("body").on('click', '#scaleName[name="scaleName"]', function(e) { $(this).select(); } );
}