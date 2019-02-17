"use strict";

// Namespace pattern
var DATA = DATA || {};

/*
	MODE TYPES:
		0 = medieval
		1 = modified medieval / composer
		2 = blues / experimental
		3 = world
		4 = chord / film / invented
*/

// Classical modes
DATA.getData_MedievalModes = () => {
	return "0,Ionian		    [# # ## # # #]" +
	"0,Dorian					[# ## # # ## ]" +
	"0,Phrygian					[## # # ## # ]" +
	"0,Lydian					[# # # ## # #]" +
	"0,Mixolydian				[# # ## # ## ]" +
	"0,Aeolian					[# ## # ## # ]" +
	"0,Locrian					[## # ## # # ]" +
	"";
}

// Modifications to classical modes
DATA.getData_ModifiedMedievalModes = () => {
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

// Modes that seem related to film, neoclassical, etc.
DATA.getData_Composer = () => {
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
	"2,Mystic Minor				[## # # # ## ]" +
	"2,Mystic Scale				[# # # #  ## ]" +
	"";
}

// Blues and bebop. I don't play either so idk if they should be in the same category
DATA.getData_Blues = () => {
	return "2,Blues Scale		[# ## ###  # ]" +
	"2,Major Bebop				[# # ## ### #]" +
	"2,Major Pentatonic			[# # #  # #  ]" +
	"2,Minor Pentatonic			[#  # # #  # ]" +
	"2,Bebop Dominant			[# # ## # ###]" +
	"2,Bebop Dorian				[# ## # # ###]" +
	"";
}

// Modes that seem strange to me. Strange is good, but strange is also strange.
DATA.getData_Experimental = () => {
	return "2,Whole Tone Scale	[# # # # # # ]" +
	"2,Chromatic Scale			[############]" +
	"2,Altered Scale			[## ## # # # ]" +
	"2,Hemitonic Pentatonic 3	[# ##   #   #]" +
	"2,Esoteric 6th				[  #  #   # #]" +
	"2,New Pentatonic			[# # # #  #  ]" +
	"2,Pentatonic Variation		[#   #  # ## ]" +
	"";
}

// Modes that are good for world traveling
DATA.getData_World1 = () => {
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
	"";
}

// More world modes that look harder to write pieces for
DATA.getData_World2 = () => {
	return "3,Hirajoshi			[#   # ##   #]" +
	"3,In Scale					[##   # ##  #]" +
	"3,Insen Scale				[##   # #  # ]" +
	"3,Iwato Scale				[##   ##   # ]" +
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
	"3,Bugle Scale				[#    #   #  ]" +
	"";
}

// 
DATA.getData_TwoChord = () => {
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

DATA.getData_FamousChords = () => {
	return "4,Scriabin Chord	[# # # #  ## ]" +
	"4,Elektra Chord			[##  #  # #  ]" + /* usually in E */
	"4,Dream Chord			    [#    #  #   ]" + /* usually in G */
	"4,Tristan Chord			[#  #  #   # ]" + /* very spread out */
	"";
}

DATA.getData_FilmThemes = () => {
	return "4,'She Never Sleeps'	[ ###  ### ##]" +
	"";
}

DATA.getData_Invented = () => {
	return "4,Samara Scale		[## #  ## # #]" +
	"4,Malicious Minor			[# ## ####  #]" +
	"";
}

DATA.getData_ForTesting = () => {
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
DATA.getTempData = (datasets) => {
	let dataString = "";

	const testType = 1;
	if (testType == 0) {
		dataString = getData_ForTesting();
	} else {
		if (datasets[0]) dataString += DATA.getData_MedievalModes();
		if (datasets[1]) dataString += DATA.getData_ModifiedMedievalModes();
		if (datasets[2]) dataString += DATA.getData_Composer();
		if (datasets[3]) dataString += DATA.getData_Blues();
		if (datasets[4]) dataString += DATA.getData_Experimental();
		if (datasets[5]) dataString += DATA.getData_World1();
		if (datasets[6]) dataString += DATA.getData_World2();
		if (datasets[7]) dataString += DATA.getData_TwoChord();
		if (datasets[8]) dataString += DATA.getData_FamousChords();
		if (datasets[9]) dataString += DATA.getData_FilmThemes();
		if (datasets[10]) dataString += DATA.getData_Invented();
	}

	const spl = dataString.split(/\[|\]/);

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

// Loads pre-generated graph as default display
DATA.runStartingGraph = () => {
	const graph = {"nodes":[{"id":"G New Scale","group":0,"type":0,"edgeStrMult":1,"impact":1,"fixed":"TRUE","x":102.79831408708202,"y":603.0007745865246},{"id":"G Aeolian","group":1,"type":0,"edgeStrMult":1,"impact":1,"fixed":"TRUE","x":1394.5136651751022,"y":595.5554681272924},{"id":"G Phrygian","group":1,"type":0,"edgeStrMult":1,"impact":0.836621137462811,"fixed":"TRUE","x":26.334878748706938,"y":283.7187725443998},{"id":"G Hexatonic Minor","group":1,"type":3,"edgeStrMult":1,"impact":0.7993174035960768,"fixed":"TRUE","x":91.43301087308711,"y":566.0509459540073},{"id":"G Blues Scale","group":1,"type":2,"edgeStrMult":1,"impact":0.7076244566047531,"fixed":"TRUE","x":1009.9810308862714,"y":390.4374581984226},{"id":"G Minor Pentatonic","group":1,"type":2,"edgeStrMult":1,"impact":0.6967153748744226,"fixed":"TRUE","x":92.00039096185584,"y":442.5865197613513},{"id":"G Locrian","group":1,"type":0,"edgeStrMult":1,"impact":0.5694560157149501,"fixed":"TRUE","x":303.38813319070954,"y":252.96966311793935},{"id":"G Gypsy Minor","group":1,"type":3,"edgeStrMult":1,"impact":0.5550619039186684,"fixed":"TRUE","x":280.36520208340494,"y":273.58879481300403},{"id":"G Tristan","group":1,"type":4,"edgeStrMult":1,"impact":0.543697462762195,"fixed":"TRUE","x":781.0342215631908,"y":638.9675441761786},{"id":"G Hirojoshi Scale","group":1,"type":3,"edgeStrMult":1,"impact":0.5325292900026632,"fixed":"TRUE","x":836.2441077113624,"y":278.5884707981162},{"id":"G Half Diminished","group":1,"type":1,"edgeStrMult":1,"impact":0.5257876011623563,"fixed":"TRUE","x":1198.5970976344809,"y":288.28311305166517},{"id":"G Pelog (approx)","group":1,"type":3,"edgeStrMult":1,"impact":0.5179251549659949,"fixed":"TRUE","x":390.31333219900955,"y":449.4955267590375},{"id":"G Balinese Scale","group":2,"type":3,"edgeStrMult":1,"impact":0.320981825760529,"fixed":"TRUE","x":461.1013520593043,"y":396.9241466692066},{"id":"G Pelog Pentatonic","group":2,"type":3,"edgeStrMult":1,"impact":0.20898021370866499,"fixed":"TRUE","x":491.4420594311723,"y":576.7772744957313},{"id":"G Iwato","group":2,"type":3,"edgeStrMult":1,"impact":0.20948825764407167,"fixed":"TRUE","x":37.01359645936465,"y":481.79221529258325}],"links":[{"source":"G Pelog Pentatonic","target":"G Iwato","value":0.10030106365651785,"weight":0.10030106365651785,"alpha":0.45,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Pelog (approx)","value":0.1965419249433247,"weight":0.1965419249433247,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Half Diminished","value":0.20964600193726043,"weight":0.20964600193726043,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Hirojoshi Scale","value":0.22088215000443878,"weight":0.22088215000443878,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Tristan","value":0.239495771270325,"weight":0.239495771270325,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Gypsy Minor","value":0.25843650653111394,"weight":0.25843650653111394,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Locrian","value":0.2824266928582502,"weight":0.2824266928582502,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Phrygian","target":"G Pelog Pentatonic","value":0.291115948450056,"weight":0.291115948450056,"alpha":0.55,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Locrian","target":"G Pelog Pentatonic","value":0.29681830370268353,"weight":0.29681830370268353,"alpha":0.55,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Half Diminished","target":"G Gypsy Minor","value":0.3104880408485291,"weight":0.3104880408485291,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Minor Pentatonic","target":"G Tristan","value":0.3167303792009216,"weight":0.3167303792009216,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Locrian","target":"G Iwato","value":0.31865684833693886,"weight":0.31865684833693886,"alpha":0.55,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Locrian","target":"G Hexatonic Minor","value":0.31899573907657075,"weight":0.31899573907657075,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Pelog (approx)","target":"G Pelog Pentatonic","value":0.3281010445663183,"weight":0.3281010445663183,"alpha":0.55,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Blues Scale","target":"G Hexatonic Minor","value":0.3301498666388765,"weight":0.3301498666388765,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Tristan","target":"G Pelog Pentatonic","value":0.3341357371874199,"weight":0.3341357371874199,"alpha":0.55,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Phrygian","target":"G Blues Scale","value":0.3491107177453192,"weight":0.3491107177453192,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Balinese Scale","target":"G Pelog Pentatonic","value":0.3544741277335646,"weight":0.3544741277335646,"alpha":0.45,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Blues Scale","target":"G Minor Pentatonic","value":0.35460509287712966,"weight":0.35460509287712966,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Locrian","target":"G Blues Scale","value":0.3598081025080344,"weight":0.3598081025080344,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Phrygian","target":"G Pelog (approx)","value":0.37136793014757263,"weight":0.37136793014757263,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Locrian","target":"G Pelog (approx)","value":0.3827473162144875,"weight":0.3827473162144875,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Blues Scale","target":"G Pelog (approx)","value":0.3939788747383544,"weight":0.3939788747383544,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Phrygian","target":"G Minor Pentatonic","value":0.48539862051931704,"weight":0.48539862051931704,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Minor Pentatonic","value":0.4945256247907043,"weight":0.4945256247907043,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Aeolian","target":"G Minor Pentatonic","value":0.4945256247907043,"weight":0.4945256247907043,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Blues Scale","target":"G Gypsy Minor","value":0.4974642227931347,"weight":0.4974642227931347,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Gypsy Minor","target":"G Pelog (approx)","value":0.506410813837599,"weight":0.506410813837599,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Blues Scale","value":0.5127074276745884,"weight":0.5127074276745884,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Aeolian","target":"G Blues Scale","value":0.5127074276745884,"weight":0.5127074276745884,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Half Diminished","target":"G Tristan","value":0.5333580402239994,"weight":0.5333580402239994,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Phrygian","target":"G Locrian","value":0.5336480568989912,"weight":0.5336480568989912,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Phrygian","target":"G Hexatonic Minor","value":0.6457422924696867,"weight":0.6457422924696867,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Hexatonic Minor","value":0.6655290059934614,"weight":0.6655290059934614,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Aeolian","target":"G Hexatonic Minor","value":0.6655290059934614,"weight":0.6655290059934614,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Minor Pentatonic","target":"G Hexatonic Minor","value":0.6695484215896949,"weight":0.6695484215896949,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Hirojoshi Scale","target":"G Balinese Scale","value":0.7149198925333212,"weight":0.7149198925333212,"alpha":0.55,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Phrygian","value":0.7277018957713515,"weight":0.7277018957713515,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Phrygian","target":"G Aeolian","value":0.7277018957713515,"weight":0.7277018957713515,"alpha":0.8,"edgeStrMult":1,"edgeDistMult":1},{"source":"G New Scale","target":"G Aeolian","value":1,"weight":1,"alpha":1,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Balinese Scale","target":"G Balinese Scale","value":1,"weight":1,"alpha":0.45,"edgeStrMult":1,"edgeDistMult":1},{"source":"G Pelog Pentatonic","target":"G Pelog Pentatonic","value":1,"weight":1,"alpha":0.45,"edgeStrMult":1,"edgeDistMult":1}],"modeDict":{"G New Scale":{"label":"New Scale","isUser":true,"type":0,"key":7,"name":"G New Scale","n":[true,false,true,true,false,true,false,true,false,true,true,false],"c":[true,false,true,true,false,true,false,true,true,false,true,false],"aliases":[]},"G Aeolian":{"label":"Aeolian","type":0,"isUser":false,"key":7,"name":"G Aeolian","n":[true,false,true,true,false,true,false,true,false,true,true,false],"c":[true,false,true,true,false,true,false,true,true,false,true,false],"aliases":[]},"G Phrygian":{"label":"Phrygian","type":0,"isUser":false,"key":7,"name":"G Phrygian","n":[true,false,true,true,false,true,false,true,true,false,true,false],"c":[true,true,false,true,false,true,false,true,true,false,true,false],"aliases":[]},"G Hexatonic Minor":{"label":"Hexatonic Minor","type":3,"isUser":false,"key":7,"name":"G Hexatonic Minor","n":[true,false,true,true,false,true,false,true,false,false,true,false],"c":[true,false,false,true,false,true,false,true,true,false,true,false],"aliases":[]},"G Blues Scale":{"label":"Blues Scale","type":2,"isUser":false,"key":7,"name":"G Blues Scale","n":[true,true,true,false,false,true,false,true,false,true,true,false],"c":[true,false,true,true,false,true,true,true,false,false,true,false],"aliases":[]},"G Minor Pentatonic":{"label":"Minor Pentatonic","type":2,"isUser":false,"key":7,"name":"G Minor Pentatonic","n":[true,false,true,false,false,true,false,true,false,false,true,false],"c":[true,false,false,true,false,true,false,true,false,false,true,false],"aliases":["Yo Scale"]},"G Locrian":{"label":"Locrian","type":0,"isUser":false,"key":7,"name":"G Locrian","n":[true,true,false,true,false,true,false,true,true,false,true,false],"c":[true,true,false,true,false,true,true,false,true,false,true,false],"aliases":[]},"G Gypsy Minor":{"label":"Gypsy Minor","type":3,"isUser":false,"key":7,"name":"G Gypsy Minor","n":[false,true,true,true,false,true,false,true,false,true,true,false],"c":[true,false,true,true,false,false,true,true,true,false,true,false],"aliases":["Hungarian Gypsy Scale"]},"G Tristan":{"label":"Tristan","type":4,"isUser":false,"key":7,"name":"G Tristan","n":[false,true,false,false,false,true,false,true,false,false,true,false],"c":[true,false,false,true,false,false,true,false,false,false,true,false],"aliases":[]},"G Hirojoshi Scale":{"label":"Hirojoshi Scale","type":3,"isUser":false,"key":7,"name":"G Hirojoshi Scale","n":[false,false,true,true,false,false,false,true,false,true,true,false],"c":[true,false,true,true,false,false,false,true,true,false,false,false],"aliases":[]},"G Half Diminished":{"label":"Half Diminished","type":1,"isUser":false,"key":7,"name":"G Half Diminished","n":[false,true,false,true,false,true,false,true,false,true,true,false],"c":[true,false,true,true,false,false,true,false,true,false,true,false],"aliases":[]},"G Pelog (approx)":{"label":"Pelog (approx)","type":3,"isUser":false,"key":7,"name":"G Pelog (approx)","n":[false,true,true,true,false,true,false,true,true,false,true,false],"c":[true,true,false,true,false,false,true,true,true,false,true,false],"aliases":[]},"G Balinese Scale":{"label":"Balinese Scale","type":3,"isUser":false,"key":7,"name":"G Balinese Scale","n":[false,false,true,true,false,false,false,true,true,false,true,false],"c":[true,true,false,true,false,false,false,true,true,false,false,false],"aliases":[]},"G Pelog Pentatonic":{"label":"Pelog Pentatonic","type":3,"isUser":false,"key":7,"name":"G Pelog Pentatonic","n":[false,false,true,false,false,true,false,true,true,false,true,false],"c":[true,true,false,true,false,false,false,true,false,false,true,false],"aliases":[]},"G Iwato":{"label":"Iwato","type":3,"isUser":false,"key":7,"name":"G Iwato","n":[true,true,false,false,false,true,false,true,true,false,false,false],"c":[true,true,false,false,false,true,true,false,false,false,true,false],"aliases":[]}},"modeImpact":{"G Aeolian":1,"G Phrygian":0.836621137462811,"G Hexatonic Minor":0.7993174035960768,"G Blues Scale":0.7076244566047531,"G Minor Pentatonic":0.6967153748744226,"G Locrian":0.5694560157149501,"G Gypsy Minor":0.5550619039186684,"G Tristan":0.543697462762195,"G Hirojoshi Scale":0.5325292900026632,"G Half Diminished":0.5257876011623563,"G Pelog (approx)":0.5179251549659949,"G Balinese Scale":0.320981825760529,"G Pelog Pentatonic":0.20898021370866499,"G Iwato":0.20948825764407167},"usedNodes":{},"edgeCount":{"G Aeolian":1,"G New Scale":null,"G Phrygian":2,"G Hexatonic Minor":1,"G Blues Scale":1,"G Minor Pentatonic":1,"G Locrian":3,"G Gypsy Minor":1,"G Tristan":2,"G Hirojoshi Scale":2,"G Half Diminished":1,"G Pelog (approx)":2,"G Balinese Scale":1,"G Pelog Pentatonic":4,"G Iwato":1}};
	createD3Graph(graph, "G New Scale");
}

// Creates a mode with random notes and a random name
DATA.randomMode = () => {
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
		if (rr < 100) {
			i++;
		}
		else if (rr < 170) {
			i += 3;
		}
		else if (rr < 220) {
			i += 4;
		}
		else if (rr < 235) {
			i += (1 + Math.random() * 11);
		}
		else {
			i += 2;
		}
	}
	mode.c = mode.n;
	mode.aliases = [];

	return mode;
}

