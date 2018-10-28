"use strict";

// MODE TYPES
// 0 = medieval
// 1 = modified medieval / composer
// 2 = blues / experimental
// 3 = world
// 4 = chord / film / invented

var getData_MedievalModes = () => {
	return "0,Ionian		    [# # ## # # #]" +
	"0,Dorian					[# ## # # ## ]" +
	"0,Phrygian					[## # # ## # ]" +
	"0,Lydian					[# # # ## # #]" +
	"0,Mixolydian				[# # ## # ## ]" +
	"0,Aeolian					[# ## # ## # ]" +
	"0,Locrian					[## # ## # # ]" +
	"";
}

var getData_ModifiedMedievalModes = () => {
	return "1,Harmonic Minor	[# ## # ##  #]" +
	"1,Melodic Minor			[# ## # # # #]" +
	"1,Harmonic Major			[# # ## ##  #]" +
	"1,Dorian #4				[# ##  ## ## ]" +
	"1,Lydian #9				[#  ## ## # #]" +
	"1,Super Locrian			[## ## # # # ]" +
	"1,Lydian Augmented			[# # # # ## #]" +
	"1,Phrygian Dominant		[##  ## ## # ]" +
	"1,Major Locrian 			[# # ### # # ]" +
	"1,Double Harmonic Major	[##  ## ##  #]" +
	"1,Harmonic Minor Dom 7th	[#  #   #   #]" +
	"1,Melodic Minor Dom 7th	[#  # #   #  ]" +
	"1,Mixolydian Flat 6		[# # ## ## # ]" +
	"1,Lydian Diminished Scale	[# ##  ## # #]" +
	"1,Mixolydian #11			[# # # ## ## ]" +
	"1,Lydian b7				[# # # ## ## ]" +
	"1,Dorian b2				[## # # # ## ]" +
	"1,Super Locrian bb7		[## ## # ##  ]" +
	"";
}

var getData_Composer = () => {
	return "1,Prometheus Scale	[# # # #  ## ]" +
	"1,Lydian #9				[#  ## ## # #]" +
	"1,Tritone Scale			[##  # ##  # ]" +
	"1,Augmented				[#  ##  ##  #]" +
	"1,Diminished				[# ## ## ## #]" +
	"1,Leading Tone				[# # # # # ##]" +
	"1,Overtone					[# # # ### # ]" +
	"1,Neapolitan Major			[## # # # # #]" +
	"1,Neapolitan Minor			[## # # ##  #]" +
	"1,Half Diminished			[# ##  # # # ]" +
	"1,Enigmatic				[##  # # # ##]" +
	"1,Double Harmonic Major	[##  ## ##  #]" +
	"1,Istrian					[## ## #   # ]" +
	"2,Whole Tone Scale			[# # # # # # ]" +
	"2,Chromatic Scale			[############]" +
	"";
}

var getData_Blues = () => {
	return "2,Blues Scale		[# ## ###  # ]" +
	"2,Major Bebop				[# # ## ### #]" +
	"2,Major Pentatonic			[# # #  # #  ]" +
	"2,Minor Pentatonic			[#  # # #  # ]" +
	"2,Bebop Dominant			[# # ## # ###]" +
	"2,Bebop Dorian				[# ## # # ###]" +
	"";
}

var getData_Experimental = () => {
	return "2,Whole Tone Scale	[# # # # # # ]" +
	"2,Chromatic Scale			[############]" +
	"2,Altered Scale			[## ## # # # ]" +
	"2,Hemitonic Pentatonic 3	[# ##   #   #]" +
	"2,Esoteric 6th				[  #  #   # #]" +
	"2,New Pentatonic			[# # # #  #  ]" +
	"2,Pentatonic Variation		[#   #  # ## ]" +
	"";
}

var getData_World1 = () => {
	return "3,Hungarian Minor	[# ##  ###  #]" +
	"3,Flamenco					[##  ## ##  #]" +
	"3,Gypsy Minor				[# ##  ### # ]" +
	"3,Gypsy Scale 2			[##  ## ##  #]" +
	"3,Hungarian Gypsy Scale	[# ##  ### # ]" +
	"3,Spanish Gypsy Scale		[##  ## ## # ]" +
	"3,Arabian					[# # ### # # ]" +
	"3,Chinese Scale			[# # #  # #  ]" +
	"3,Persian Scale			[##  ### #  #]" +
	"3,Urkainian Dorian			[# ##  ## ## ]" +
	"3,Acoustic Scale			[# # # ## ## ]" +
	"3,Byzantine				[##  ## ##  #]" +
	"3,Spanish (8 tone)			[## #### # # ]" +
	"3,Native American Scale	[# # # #  # #]" +
	"3,Hungarian Folk			[##  #  ##  #]" +
	"3,Hindu Scale				[# # ## ## # ]" +
	"3,Arabian Scale			[# # ### # # ]" +
	"3,Oriental Scale			[##  ###  ## ]" +
	"3,Scottish Scale			[# #  # # #  ]" +
	"3,Egyptian Scale			[# #  # #  # ]" +
	"3,Northern Scale 			[#  # # # #  ]" +
	"3,Hexatonic Minor 			[#  # # ## # ]" +
	"3,Bugle Scale				[#    #   #  ]" +
	"";
}

var getData_World2 = () => {
	return "3,Hirajoshi			[#   # ##   #]" +
	"3,In Scale					[##   # ##  #]" +
	"3,Insen Scale				[##   # #  # ]" +
	"3,Iwato					[##   ##   # ]" +
	"3,Pelog (approx)			[## #  ### # ]" +
	"3,Pfluke Scale				[# ##  ## # #]" +
	"3,Yo Scale					[#  # # #  # ]" +
	"3,Japanese Pentatonic		[##   # ##   ]" +
	"3,Balinese Pentatonic		[##   ## #   ]" +
	"3,Pelog Pentatonic			[## #   #  # ]" +
	"3,Javanese Scale			[## # # # ## ]" +
	"3,Yo Scale					[#  # # #  # ]" +
	"3,Hirojoshi Scale			[# ##   ##   ]" +
	"3,Balinese Scale			[## #   ##   ]" +
	"3,Mongolian Scale			[# # #  # #  ]" +
	"3,Ryo Scale				[# # #  # #  ]" +
	"3,Kumoi Scale				[##   # ##   ]" +
	"";
}

var getData_TwoChord = () => {
	return "4,'Antagonism' (i - bv)	[## #  ## #  ]" +
	"4,'Antagonist' (i - bvi)	[#  #   ##  #]" +
	"4,'Outer Space' (I - bV)	[##  # ##  # ]" +
	"4,'Fantastic' (I - bVI)	[#  ##  ##   ]" +
	"4,'Romantic' (I - iv)		[#   ## ##   ]" +
	"4,'Wonder' (i - IV)		[#  # # # #  ]" +
	"4,'Transcendence' (I - v)	[# # #  #  # ]" +
	"4,'Dark Comedy' (i - II)	[# ##  ## #  ]" +
	"4,'Dramatic' (i - VII)		[#  #  ##   #]" +
	"4,'Heroic'	 (I - II7)		[# # # ## #  ]" +
	"";
}

var getData_FamousChords = () => {
	return "4,Scriabin			[# # # #  ## ]" +
	"4,Mystic Minor				[## # # # ## ]" +
	"4,Mystic Scale				[# # # #  ## ]" +
	"4,Elektra					[##  #  # #  ]" + /* usually in E */
	"4,Dream				    [#    #  #   ]" + /* usually in G */
	"4,Tristan					[#  #  #   # ]" + /* very spread out */
	"";
}

var getData_FilmThemes = () => {
	return "4,'She Never Sleeps'	[ ###  ### ##]" +
	"";
}

var getData_Invented = () => {
	return "4,Samara Scale		[## #  ## # #]" +
	"";
}

var getData_ForTesting = () => {
	return "1,Ionian		    [# # ## # # #]" +
	"1,Dorian					[# ## # # ## ]" +
	"1,Phrygian					[## # # ## # ]" +
	"1,Lydian					[# # # ## # #]" +
	"1,Mixolydian				[# # ## # ## ]" +
	"1,Aeolian					[# ## # ## # ]" +
	"1,Locrian					[## # ## # # ]" +

	"2,Lydian #9				[#  ## ## # #]" +
	"2,Diminished				[# ## ## ## #]" +
	"2,Urkainian Dorian			[# ##  ## ## ]" +
	"3,Samara Scale				[## #  ## # #]" +
	"2,Whole Tone Scale			[# # # # # # ]" +
	"2,Chromatic Scale			[############]" +
	"3,'She Never Sleeps'		[ ###  ### ##]" +
	"";
}

// Get modes from test data
var getTempData = (datasets) => {
	let str = "";

	const testType = 1;
	if (testType == 0) {
		str = getData_ForTesting();
	} else {
		if (datasets[0]) str += getData_MedievalModes();
		if (datasets[1]) str += getData_ModifiedMedievalModes();
		if (datasets[2]) str += getData_Composer();
		if (datasets[3]) str += getData_Blues();
		if (datasets[4]) str += getData_Experimental();
		if (datasets[5]) str += getData_World1();
		if (datasets[6]) str += getData_World2();
		if (datasets[7]) str += getData_TwoChord();
		if (datasets[8]) str += getData_FamousChords();
		if (datasets[9]) str += getData_FilmThemes();
		if (datasets[10]) str += getData_Invented();
	}

	const spl = str.split(/\[|\]/);

	let i = 0;
	let modes = [];
	let usedNames = new Set();
	while (i * 2 + 1 < spl.length) {
		let mode = {};
		const typeAndName = spl[i * 2 + 0].trim().split(',');
		const newName = typeAndName[1];

		if (!usedNames.has(newName)) {
			usedNames.add(newName);
			
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
		}

		++i;
	}

	//console.log(modes);

	return modes;
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
	createD3Graph(graph, "G Unknown Scale");
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

