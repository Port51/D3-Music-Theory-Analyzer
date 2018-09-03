
// Shared data
var rootSel = 7; // default to key of G
var keySel =		    [false, false, true, false, false, false, false, true, false, false, true, false];
var keySelVis =		    [false, false, false, false, false, false, false, false, false, false, false, false];
var mouseOverKey = -1;
var keyMouseOverVis =	[false, false, false, false, false, false, false, false, false, false, false, false];
var modeDict = {};
var allowD3Physics = true;
var allowD3Sticky = true;


var runSimulation = () => {
	// Trigger collapse settings
	$('#settings-collapse').trigger('click');

	settings = createSettings();
	exa = createUserMode();

	useGraph = true;
	if (!useGraph) {
		// DEBUG: Just print results to console
		runAnalysis(0.0, settings, exa);
	}
	else {
		// DEBUG: Handle D3 graph
		const svg = d3.select("svg");
		const width = +svg.property("viewBox").baseVal.width;
		const height = +svg.property("viewBox").baseVal.height;

		const results = runAnalysis(0.025, settings, exa);
		const graph = convertAnalysisToGraph(results.modes, results.pairs, 2, width, height, settings);
		//console.log(JSON.stringify(graph));

		createD3Graph(graph);


	} // end useGraph
} // end runSim

// Create settings
var createSettings = () => {
	// Get inputs
	let noteSim = 0.75;

	return {
		datasetID:  				parseInt($("#datasetID").find(":selected").val()),
		wFactorRootMissing: 		parseFloat($("#rootMissing").val() / 100),
		wFactorNoteSimilarity: 		parseFloat($("#noteSim").val() / 100),
		wFactorAdd: 				parseFloat($("#noteAdd").val() / 100),
		wFactorRemove: 				parseFloat($("#noteRem").val() / 100),
		wFactorRootOffset: 			parseFloat($("#rootOff").val() / 25),
		wFactorMoodHappy:   		parseFloat($("#moodEstimHappy").val() / 100),
		wFactorMoodBittersweet:   	parseFloat($("#moodEstimBittersweet").val() / 100),
		wFactorIntervalCount: 		parseFloat($("#iCount").val() / 100),
		wFactorIntervalOpenness: 	parseFloat($("#iOpen").val() / 100),
		filterResultMax: 			parseInt($("#filterResultMax").val()),
	};
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
	console.log("Show modal #" + id);
	var modal = $("#modal-" + id);

	if (id == 0) {
		// Ensure correct key highlights
		setKeyColors();
	}

	if (active) {
		modal.css('display', 'block');
	} else {
		modal.css('display', 'none');
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
	rootSel = note;

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
		$(this).removeClass(animName).width($(this).width()).addClass(animName);
	});

}

// Update colors for root selection
var setRootSelectColors = () => {
	for (let i = 0; i < 12; ++i) {
		$('.rootSelect[value="' + i + '"]').find("span").attr('value', (rootSel == i));
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
				// Trigger animation
				resetAnimation($('.pianoKey[value="' + i + '"]'), "jitterKey");
			}
			else
				$(".pianoKey[value=" + i + "]").attr('highlight', 'false');

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

// Create mode based on notes selected by user
var createUserMode = () => {
	let mode = {};
	mode.label = $('#scaleName[name="scaleName"]').val();
	mode.isUser = true;
	mode.type = 0;
	mode.key = rootSel;
	mode.name = getNoteName(mode.key) + ' ' + mode.label;

	mode.n = [];
	for (let i = 0; i < 12; ++i) {
		mode.n.push(keySel[i]);
	}

	// Un-transpose to static version
	mode.c = [];
	for (let i = 0; i < 12; ++i) {
		mode.c.push(mode.n[(i + mode.key) % 12]);
	}

	console.log("USER SCALE BELOW: (transposed, then static)");
	console.log(mode.n);
	console.log(mode.c);
	mode.aliases = [];

	return mode;
}

var buttonRunFromSettings = () => {
	console.log("buttonRunFromSettings");

	// Close modal window
	setModalActive(1, false);

	// Run analysis
	runSimulation();

}

var buttonRunFromPiano = () => {
	console.log("buttonRunFromPiano");
	
	// Check for any notes selected
	let numNotes = 0;
	for (let i = 0; i < 12; ++i) {
		if (keySel[i]) {
			numNotes++;
		}
	}

	// Close modal window
	setModalActive(0, false);

	// Run analysis
	runSimulation();

}

// Quick slider manip functions
var slidersZero = () => { const rememberFilter = $("#filterResultMax").val(); $(".slider").val("0"); $("#filterResultMax").val(rememberFilter); }
var slidersMid = () => { const rememberFilter = $("#filterResultMax").val(); $(".slider").val("50"); $("#filterResultMax").val(rememberFilter); }
var slidersDefault = () => { const rememberFilter = $("#filterResultMax").val(); $(".slider").each(function() { $(this).val($(this).attr('def')) }); $("#filterResultMax").val(rememberFilter); }
var slidersFull = () => { const rememberFilter = $("#filterResultMax").val(); $(".slider").val("100"); $("#filterResultMax").val(rememberFilter); }

var setInstructionsInputFunctions = () => {
	$("#closeInstructions").click(buttonCloseInstructions);
}

var setSliderInputFunctions = () => {
	$("#runFromSettings").click(buttonRunFromSettings);
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