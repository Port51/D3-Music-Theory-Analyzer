"use strict";

// Temporary script for loading modes
var getTempString = () => {
	return "1,Ionian		    [# # ## # # #]" +
	"1,Dorian					[# ## # # ## ]" +
	"1,Phrygian					[## # # ## # ]" +
	"1,Lydian					[# # # ## # #]" +
	"1,Mixolydian				[# # ## # ## ]" +
	"1,Aeolian					[# ## # ## # ]" +
	"1,Locrian					[## # ## # # ]" +
	"1,Harmonic Minor			[# ## # ##  #]" +
	"1,Melodic Minor			[# ## # # # #]" +
	"1,Harmonic Major			[# # ## ##  #]" +
	"2,Dorian #4				[# ##  ## ## ]" +
	"2,Whole Tone Scale			[# # # # # # ]" +
	"2,Chromatic Scale			[############]" +
	"2,Lydian #9				[#  ## ## # #]" +
	"2,Double Harmonic Major	[##  ## ##  #]" +
	"3,Scriabin					[# # # #  ## ]" +
	"3,Mystic Minor				[## # # # ## ]" +
	"2,Altered Scale			[## ## # # # ]" +
	"2,Blues Scale				[# ## ###  # ]" +
	"2,Enigmatic				[##  # # # ##]" +
	"2,Flamenco					[##  ## ##  #]" +
	"2,Gypsy Scale				[# ##  ### # ]" +
	"2,Half Diminished			[# ##  # # # ]" +
	"2,Hirajoshi				[#   # ##   #]" +
	"2,Hungarian Minor			[# ##  ###  #]" +
	"2,In Scale					[##   # ##  #]" +
	"2,Insen Scale				[##   # #  # ]" +
	"2,Istrian					[## ## #   # ]" +
	"2,Iwato					[##   ##   # ]" +
	"2,Lydian Augmented			[# # # # ## #]" +
	"2,Major Bebop				[# # ## ### #]" +
	"2,Major Locrian (Arabian)	[# # ### # # ]" +
	"2,Major Pentatonic			[# # #  # #  ]" +
	"2,Chinese Scale			[# # #  # #  ]" +
	"2,Minor Pentatonic			[#  # # #  # ]" +
	"2,Neapolitan Major			[## # # # # #]" +
	"2,Neapolitan Minor			[## # # ##  #]" +
	"2,Pelog (approx)			[## #  ### # ]" +
	"2,Persian Scale			[##  ### #  #]" +
	"2,Pfluke Scale				[# ##  ## # #]" +
	"2,Phrygian Dominant		[##  ## ## # ]" +
	"2,Prometheus Scale			[# # # #  ## ]" +
	"2,Tritone Scale			[##  # ##  # ]" +
	"2,Urkainian Dorian			[# ##  ## ## ]" +
	"2,Yo Scale					[#  # # #  # ]" +
	"2,Acoustic Scale			[# # # ## ## ]" +
	"2,Bebop Dominant			[# # ## # ###]" +
	"2,New Pentatonic			[# # # #  #  ]" +
	"2,Pentatonic (Japan)		[##   # ##   ]" +
	"2,Pentatonic (Balinese)	[##   ## #   ]" +
	"2,Pentatonic (Pelog)		[## #   #  # ]" +
	"2,Hemitonic Pentatonic 3	[# ##   #   #]" +
	"2,Pentatonic Variation		[#   #  # ## ]" +
	"2,Harmonic Minor Dom 7th	[#  #   #   #]" +
	"2,Melodic Minor Dom 7th	[#  # #   #  ]" +
	"2,Esoteric 6th				[  #  #   # #]" +
	"2,Augmented				[#  ##  ##  #]" +
	"2,Diminished				[# ## ## ## #]" +
	"2,Gypsy (Byzantine)		[##  ## ##  #]" +
	"2,Spanish (8 tone)			[## #### # # ]" +
	"2,Hungarian Gypsy			[# ##  ### # ]" +
	"2,Native American			[# # # #  # #]" +
	"2,Hungarian Folk			[##  #  ##  #]" +
	"2,Leading Tone				[# # # # # ##]" +
	"2,Overtone					[# # # ### # ]" +
	"2,Hindu Scale				[# # ## ## # ]" +
	"2,Spanish Gypsy			[##  ## ## # ]" +
	"2,Arabian Scale			[# # ### # # ]" +
	"2,Oriental Scale			[##  ###  ## ]" +
	"2,Gypsy Minor				[# ##  ### # ]" +
	"2,Javanese Scale			[## # # # ## ]" +
	"2,Scottish Scale			[# #  # # #  ]" +
	"2,Kumoi Scale				[##   # ##   ]" +
	"2,Egyptian Scale			[# #  # #  # ]" +
	"2,Yo Scale					[#  # # #  # ]" +
	"2,Hirojoshi Scale			[# ##   ##   ]" +
	"2,Balinese Scale			[## #   ##   ]" +
	"2,Mongolian Scale			[# # #  # #  ]" +
	"2,Ryo Scale				[# # #  # #  ]" +
	"2,Mystic Scale				[# # # #  ## ]" +
	"2,Bebop Dorian				[# ## # # ###]" +
	"3,Antagonism (Chords)		[## #  ## #  ]" +
	"3,Vader Theme (Chords)		[#  #   ##  #]" +
	"3,Elektra (Chord)			[##  #  # #  ]" + /* usually in E */
	"3,Dream (Chord)		    [#    #  #   ]" + /* usually in G */
	"3,Tristan (Chord)			[#  #  #   # ]" + /* very spread out */
	"2,Mixolydian Flat 6		[# # ## ## # ]" +
	"";
}

// Get modes from test data
var getTempData = () => {
	const str = getTempString();
	const spl = str.split(/\[|\]/);

	let i = 0;
	let modes = [];
	while (i * 2 + 1 < spl.length) {
		let mode = {};
		const typeAndName = spl[i * 2 + 0].trim().split(',');
		mode.label = typeAndName[1];
		mode.type = parseInt(typeAndName[0]);
        mode.isUser = false;
		mode.key = 0;
		mode.name = getNoteName(mode.key) + ' ' + mode.label;

		mode.n = [];
		const notes = spl[i * 2 + 1].toString();
		for (let j = 0; j < notes.length; ++j) {
			if (notes.charAt(j) == ' ') {
				mode.n.push(false);
			}
			else {
				mode.n.push(true);
			}
		}
		mode.c = mode.n;
		mode.aliases = [];

		modes.push(mode);
		++i;
	}

	//console.log(modes);

	return modes;
}

// Classical modes and a few common variations for quick testing
var getMedievalModes = () => {
	return [
		createMode("Ionian", 1,					"# # ## # # #"),
		createMode("Lydian", 1, 				"# # # ## # #"),
		createMode("Mixolydian", 1,				"# # ## # ## "),
		createMode("Aeolian", 1,				"# ## # ## # "),
		createMode("Dorian", 1,					"# ## # # ## "),
		createMode("Phrygian", 1,				"## # # ## # "),
		createMode("Locrian", 1,				"## # ##  # #"),
		createMode("Harmonic Minor", 1,			"# ## # ##  #"),
		createMode("Melodic Minor", 1,			"# ## # # # #"),
		createMode("Harmonic Major", 1,			"# # ## ##  #"),
	];
}

// Just a few modes for quick testing
var getDebugModes = () => {
	return [
		createMode("Vader Theme", 3,				"#  #   ##  #"),
	];
}

// Loads pre-generated graph as default display
var runStartingGraph = () => {
	const graph = {"nodes":[{"id":"G Unknown Scale","group":0,"type":0,"fixed":"TRUE","x":554.759116073945,"y":511.1169339221034},{"id":"G Hungarian Minor","group":1,"type":2,"fixed":"TRUE","x":998.4956908330416,"y":6.981158376621188},{"id":"G Hemitonic Pentatonic 3","group":1,"type":2,"fixed":"TRUE","x":521.3983014635212,"y":532.0695158286},{"id":"G Vader Theme (Chords)","group":1,"type":3,"fixed":"TRUE","x":967.2619479648421,"y":68.62816517760123},{"id":"G Harmonic Minor","group":1,"type":1,"fixed":"TRUE","x":275.83538259753215,"y":303.98821964604286},{"id":"G Harmonic Minor Dom 7th","group":1,"type":2,"fixed":"TRUE","x":814.089964710408,"y":530.9343995073355},{"id":"G Diminished","group":1,"type":2,"fixed":"TRUE","x":1261.5019386659276,"y":30.39833580393009},{"id":"G Hirojoshi Scale","group":1,"type":2,"fixed":"TRUE","x":858.5319363539143,"y":633.5047134559522},{"id":"G Blues Scale","group":1,"type":2,"fixed":"TRUE","x":476.7716965282788,"y":577.6609890694883},{"id":"G Dorian #4","group":1,"type":2,"fixed":"TRUE","x":121.74864997347504,"y":408.28307423200147},{"id":"G Pfluke Scale","group":1,"type":2,"fixed":"TRUE","x":345.87385202619913,"y":116.52376840226489},{"id":"G Gypsy Scale","group":1,"type":2,"fixed":"TRUE","x":245.6222836238649,"y":671.474380301934},{"id":"G Half Diminished","group":2,"type":2,"fixed":"TRUE","x":430.8971829656933,"y":286.8873481017375},{"id":"G Neapolitan Minor","group":2,"type":2,"fixed":"TRUE","x":1394.511956896972,"y":419.65596145419295},{"id":"G Pelog (approx)","group":2,"type":2,"fixed":"TRUE","x":666.3519827858217,"y":68.13447111437105},{"id":"G Minor Pentatonic","group":2,"type":2,"fixed":"TRUE","x":619.9359735566061,"y":387.2775956633541},{"id":"G Aeolian","group":2,"type":1,"fixed":"TRUE","x":679.0977885767095,"y":241.2999310549567}],"links":[{"source":"G Pfluke Scale","target":"G Unknown Scale","value":0.22631227362738715,"weight":0.22631227362738715,"alpha":1},{"source":"G Dorian #4","target":"G Unknown Scale","value":0.2302629046365489,"weight":0.2302629046365489,"alpha":1},{"source":"G Harmonic Minor","target":"G Blues Scale","value":0.2515133088211155,"weight":0.2515133088211155,"alpha":0.6},{"source":"G Harmonic Minor","target":"G Gypsy Scale","value":0.2515133088211155,"weight":0.2515133088211155,"alpha":0.6},{"source":"G Blues Scale","target":"G Diminished","value":0.25853059680195345,"weight":0.25853059680195345,"alpha":0.6},{"source":"G Gypsy Scale","target":"G Diminished","value":0.25853059680195345,"weight":0.25853059680195345,"alpha":0.6},{"source":"G Hemitonic Pentatonic 3","target":"G Hirojoshi Scale","value":0.2919288917824074,"weight":0.2919288917824074,"alpha":0.6},{"source":"G Hirojoshi Scale","target":"G Vader Theme (Chords)","value":0.29935980902777776,"weight":0.29935980902777776,"alpha":0.6},{"source":"G Minor Pentatonic","target":"G Neapolitan Minor","value":0.30064420319402657,"weight":0.30064420319402657,"alpha":0.35},{"source":"G Blues Scale","target":"G Unknown Scale","value":0.3261293883982488,"weight":0.3261293883982488,"alpha":1},{"source":"G Gypsy Scale","target":"G Unknown Scale","value":0.3261293883982488,"weight":0.3261293883982488,"alpha":1},{"source":"G Hirojoshi Scale","target":"G Unknown Scale","value":0.3594243189663528,"weight":0.3594243189663528,"alpha":1},{"source":"G Aeolian","target":"G Pelog (approx)","value":0.36481217317691494,"weight":0.36481217317691494,"alpha":0.35},{"source":"G Blues Scale","target":"G Hirojoshi Scale","value":0.3659710924941516,"weight":0.3659710924941516,"alpha":0.6},{"source":"G Diminished","target":"G Unknown Scale","value":0.3857902863321826,"weight":0.3857902863321826,"alpha":1},{"source":"G Hungarian Minor","target":"G Hirojoshi Scale","value":0.3943395410885956,"weight":0.3943395410885956,"alpha":0.6},{"source":"G Harmonic Minor","target":"G Harmonic Minor Dom 7th","value":0.3976125,"weight":0.3976125,"alpha":0.6},{"source":"G Hungarian Minor","target":"G Harmonic Minor Dom 7th","value":0.4003125,"weight":0.4003125,"alpha":0.6},{"source":"G Harmonic Minor","target":"G Hirojoshi Scale","value":0.40184481387695903,"weight":0.40184481387695903,"alpha":0.6},{"source":"G Hungarian Minor","target":"G Diminished","value":0.4377077527543295,"weight":0.4377077527543295,"alpha":0.6},{"source":"G Hemitonic Pentatonic 3","target":"G Vader Theme (Chords)","value":0.4428453947368421,"weight":0.4428453947368421,"alpha":0.6},{"source":"G Minor Pentatonic","target":"G Pelog (approx)","value":0.4530191525112973,"weight":0.4530191525112973,"alpha":0.35},{"source":"G Gypsy Scale","target":"G Hungarian Minor","value":0.464723840396808,"weight":0.464723840396808,"alpha":0.6},{"source":"G Aeolian","target":"G Harmonic Minor","value":0.464723840396808,"weight":0.464723840396808,"alpha":0.45},{"source":"G Dorian #4","target":"G Pfluke Scale","value":0.4715874540395916,"weight":0.4715874540395916,"alpha":0.6},{"source":"G Harmonic Minor Dom 7th","target":"G Unknown Scale","value":0.4781959247090127,"weight":0.4781959247090127,"alpha":1},{"source":"G Aeolian","target":"G Half Diminished","value":0.48383671875,"weight":0.48383671875,"alpha":0.35},{"source":"G Harmonic Minor","target":"G Unknown Scale","value":0.4860975,"weight":0.4860975,"alpha":1},{"source":"G Blues Scale","target":"G Half Diminished","value":0.49191562499999997,"weight":0.49191562499999997,"alpha":0.45},{"source":"G Harmonic Minor","target":"G Diminished","value":0.5379171397331511,"weight":0.5379171397331511,"alpha":0.6},{"source":"G Harmonic Minor","target":"G Hemitonic Pentatonic 3","value":0.5500457161079984,"weight":0.5500457161079984,"alpha":0.6},{"source":"G Harmonic Minor","target":"G Hungarian Minor","value":0.5504464285714286,"weight":0.5504464285714286,"alpha":0.6},{"source":"G Hungarian Minor","target":"G Hemitonic Pentatonic 3","value":0.5534978858743665,"weight":0.5534978858743665,"alpha":0.6},{"source":"G Vader Theme (Chords)","target":"G Unknown Scale","value":0.5588556102967756,"weight":0.5588556102967756,"alpha":1},{"source":"G Harmonic Minor","target":"G Vader Theme (Chords)","value":0.5653079403382577,"weight":0.5653079403382577,"alpha":0.6},{"source":"G Hungarian Minor","target":"G Vader Theme (Chords)","value":0.5719771475649257,"weight":0.5719771475649257,"alpha":0.6},{"source":"G Aeolian","target":"G Hirojoshi Scale","value":0.5759369893557598,"weight":0.5759369893557598,"alpha":0.45},{"source":"G Neapolitan Minor","target":"G Vader Theme (Chords)","value":0.5759369893557598,"weight":0.5759369893557598,"alpha":0.45},{"source":"G Aeolian","target":"G Minor Pentatonic","value":0.5804248100520385,"weight":0.5804248100520385,"alpha":0.35},{"source":"G Gypsy Scale","target":"G Hirojoshi Scale","value":0.5855537479906426,"weight":0.5855537479906426,"alpha":0.6},{"source":"G Blues Scale","target":"G Minor Pentatonic","value":0.5914717533044167,"weight":0.5914717533044167,"alpha":0.45},{"source":"G Half Diminished","target":"G Pelog (approx)","value":0.6495750528900679,"weight":0.6495750528900679,"alpha":0.35},{"source":"G Hemitonic Pentatonic 3","target":"G Unknown Scale","value":0.662625,"weight":0.662625,"alpha":1},{"source":"G Harmonic Minor Dom 7th","target":"G Vader Theme (Chords)","value":0.68221875,"weight":0.68221875,"alpha":0.6},{"source":"G Harmonic Minor","target":"G Neapolitan Minor","value":0.6941253156562301,"weight":0.6941253156562301,"alpha":0.45},{"source":"G Gypsy Scale","target":"G Pelog (approx)","value":0.6941253156562301,"weight":0.6941253156562301,"alpha":0.45},{"source":"G Hungarian Minor","target":"G Unknown Scale","value":0.7018125,"weight":0.7018125,"alpha":1},{"source":"G Gypsy Scale","target":"G Half Diminished","value":0.7027366071428571,"weight":0.7027366071428571,"alpha":0.45},{"source":"G Blues Scale","target":"G Gypsy Scale","value":0.75,"weight":0.75,"alpha":0.6},{"source":"G Hemitonic Pentatonic 3","target":"G Harmonic Minor Dom 7th","value":0.9030326321088871,"weight":0.9030326321088871,"alpha":0.6}],"modeDict":{"G Unknown Scale":{"label":"Unknown Scale","isUser":true,"type":0,"key":7,"name":"G Unknown Scale","n":[false,true,true,false,false,false,true,true,false,true,true,false],"c":[true,false,true,true,false,false,true,true,false,false,false,true],"aliases":[]},"G Hungarian Minor":{"isUser":false,"key":7,"type":2,"label":"Hungarian Minor","name":"G Hungarian Minor","c":[true,false,true,true,false,false,true,true,true,false,false,true],"n":[false,true,true,true,false,false,true,true,false,true,true,false]},"G Hemitonic Pentatonic 3":{"isUser":false,"key":7,"type":2,"label":"Hemitonic Pentatonic 3","name":"G Hemitonic Pentatonic 3","c":[true,false,true,true,false,false,false,true,false,false,false,true],"n":[false,false,true,false,false,false,true,true,false,true,true,false]},"G Vader Theme (Chords)":{"isUser":false,"key":7,"type":3,"label":"Vader Theme (Chords)","name":"G Vader Theme (Chords)","c":[true,false,false,true,false,false,false,true,true,false,false,true],"n":[false,false,true,true,false,false,true,true,false,false,true,false]},"G Harmonic Minor":{"isUser":false,"key":7,"type":1,"label":"Harmonic Minor","name":"G Harmonic Minor","c":[true,false,true,true,false,true,false,true,true,false,false,true],"n":[true,false,true,true,false,false,true,true,false,true,true,false]},"G Harmonic Minor Dom 7th":{"isUser":false,"key":7,"type":2,"label":"Harmonic Minor Dom 7th","name":"G Harmonic Minor Dom 7th","c":[true,false,false,true,false,false,false,true,false,false,false,true],"n":[false,false,true,false,false,false,true,true,false,false,true,false]},"G Diminished":{"isUser":false,"key":7,"type":2,"label":"Diminished","name":"G Diminished","c":[true,false,true,true,false,true,true,false,true,true,false,true],"n":[true,true,false,true,true,false,true,true,false,true,true,false]},"G Hirojoshi Scale":{"isUser":false,"key":7,"type":2,"label":"Hirojoshi Scale","name":"G Hirojoshi Scale","c":[true,false,true,true,false,false,false,true,true,false,false,false],"n":[false,false,true,true,false,false,false,true,false,true,true,false]},"G Blues Scale":{"isUser":false,"key":7,"type":2,"label":"Blues Scale","name":"G Blues Scale","c":[true,false,true,true,false,true,true,true,false,false,true,false],"n":[true,true,true,false,false,true,false,true,false,true,true,false]},"G Dorian #4":{"isUser":false,"key":7,"type":2,"label":"Dorian #4","name":"G Dorian #4","c":[true,false,true,true,false,false,true,true,false,true,true,false],"n":[false,true,true,false,true,true,false,true,false,true,true,false]},"G Pfluke Scale":{"isUser":false,"key":7,"type":2,"label":"Pfluke Scale","name":"G Pfluke Scale","c":[true,false,true,true,false,false,true,true,false,true,false,true],"n":[false,true,true,false,true,false,true,true,false,true,true,false]},"G Gypsy Scale":{"isUser":false,"key":7,"type":2,"label":"Gypsy Scale","name":"G Gypsy Scale","c":[true,false,true,true,false,false,true,true,true,false,true,false],"n":[false,true,true,true,false,true,false,true,false,true,true,false]},"G Half Diminished":{"isUser":false,"key":7,"type":2,"label":"Half Diminished","name":"G Half Diminished","c":[true,false,true,true,false,false,true,false,true,false,true,false],"n":[false,true,false,true,false,true,false,true,false,true,true,false]},"G Neapolitan Minor":{"isUser":false,"key":7,"type":2,"label":"Neapolitan Minor","name":"G Neapolitan Minor","c":[true,true,false,true,false,true,false,true,true,false,false,true],"n":[true,false,true,true,false,false,true,true,true,false,true,false]},"G Pelog (approx)":{"isUser":false,"key":7,"type":2,"label":"Pelog (approx)","name":"G Pelog (approx)","c":[true,true,false,true,false,false,true,true,true,false,true,false],"n":[false,true,true,true,false,true,false,true,true,false,true,false]},"G Minor Pentatonic":{"isUser":false,"key":7,"type":2,"label":"Minor Pentatonic","name":"G Minor Pentatonic","c":[true,false,false,true,false,true,false,true,false,false,true,false],"n":[true,false,true,false,false,true,false,true,false,false,true,false]},"G Aeolian":{"isUser":false,"key":7,"type":1,"label":"Aeolian","name":"G Aeolian","c":[true,false,true,true,false,true,false,true,true,false,true,false],"n":[true,false,true,true,false,true,false,true,false,true,true,false]}}};
	createD3Graph(graph);
}

// Creates a mode with random notes and a random name
var randomMode = () => {
	let mode = {};
	mode.label = Math.random().toString(26).substr(2, 5);
	mode.isUser = false;
	mode.type = 2;
	mode.key = 0;
	mode.name = getNoteName(mode.key) + ' ' + mode.label;
	mode.n = [];
	for (let i = 0; i < NOTES_IN_SCALE; ++i)
		mode.n.push(false);

	const key = (Math.floor(Math.random() * NOTES_IN_SCALE) + NOTES_IN_SCALE) % NOTES_IN_SCALE;
	let i = 0;
	while (i < NOTES_IN_SCALE) {
		mode.n[(key + i) % NOTES_IN_SCALE] = true;

		// Random interval
		const rr = Math.random() * 1000;
		if (rr < 100)
			i++;
		else if (rr < 170)
			i += 3;
		else if (rr < 220)
			i += 4;
		else
			i += 2;
	}
	mode.c = mode.n;
	mode.aliases = [];

	return mode;
}

