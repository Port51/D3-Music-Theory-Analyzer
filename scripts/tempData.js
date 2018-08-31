"use strict";

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
		mode.name = GetNoteName(mode.key) + ' ' + mode.label;

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

var runStartingGraph = () => {
	const graph = {"nodes":[{"id":"G - YOUR SCALE","group":0,"type":0,"fixed":"TRUE","x":178.9522421395139,"y":616.8655506650324},{"id":"G Ionian","group":1,"type":1,"fixed":"TRUE","x":37.73368335260856,"y":375.7795952083115},{"id":"G Acoustic","group":1,"type":2,"fixed":"TRUE","x":1173.11829456031,"y":527.0166879426815},{"id":"G Scottish","group":1,"type":2,"fixed":"TRUE","x":1203.4381989627561,"y":155.34636833139282},{"id":"G Tritone Scale","group":1,"type":2,"fixed":"TRUE","x":1150.8569224180687,"y":35.0677077843903},{"id":"G Lydian","group":1,"type":1,"fixed":"TRUE","x":572.449474853146,"y":440.5196655323541},{"id":"G Double Harmonic Major","group":1,"type":2,"fixed":"TRUE","x":925.6875814797824,"y":400.7900177494152},{"id":"G Overtone","group":1,"type":2,"fixed":"TRUE","x":183.55606057423205,"y":264.97639025274367},{"id":"G Elektra (Chord)","group":1,"type":3,"fixed":"TRUE","x":1192.258275037317,"y":422.25122598302437},{"id":"G Major Bebop","group":1,"type":2,"fixed":"TRUE","x":544.2601255429474,"y":96.89495745958277},{"id":"G Hirajoshi","group":1,"type":2,"fixed":"TRUE","x":66.08552542546403,"y":377.506406289061},{"id":"G Phrygian Dominant","group":1,"type":2,"fixed":"TRUE","x":1213.2425496515198,"y":195.6230244050998},{"id":"G Mixolydian","group":1,"type":1,"fixed":"TRUE","x":363.99035231553745,"y":0.7027006935658053},{"id":"G Bebop Dominant","group":1,"type":2,"fixed":"TRUE","x":656.4909027383125,"y":25.73555586888048},{"id":"G Hindu","group":2,"type":2,"fixed":"TRUE","x":491.4408110869242,"y":390.6954574508244},{"id":"G Major Pentatonic","group":2,"type":2,"fixed":"TRUE","x":57.68125212549453,"y":351.1389461919109},{"id":"G New Pentatonic","group":2,"type":2,"fixed":"TRUE","x":313.10285345463456,"y":49.370969025649615},{"id":"G Pentatonic Variation","group":2,"type":2,"fixed":"TRUE","x":84.10540363011667,"y":482.04302870323124},{"id":"G Harmonic Major","group":2,"type":1,"fixed":"TRUE","x":662.3792527202897,"y":268.7494929299502}],"links":[{"source":"G Scottish","target":"G - YOUR SCALE","value":0.03745312499999998,"weight":0.03745312499999998,"alpha":1},{"source":"G Double Harmonic Major","target":"G - YOUR SCALE","value":0.09800173912519287,"weight":0.09800173912519287,"alpha":1},{"source":"G Phrygian Dominant","target":"G - YOUR SCALE","value":0.09962160258180763,"weight":0.09962160258180763,"alpha":1},{"source":"G Overtone","target":"G - YOUR SCALE","value":0.17592705620659727,"weight":0.17592705620659727,"alpha":1},{"source":"G Ionian","target":"G Acoustic","value":0.2515133088211155,"weight":0.2515133088211155,"alpha":0.6},{"source":"G Lydian","target":"G Mixolydian","value":0.2515133088211155,"weight":0.2515133088211155,"alpha":0.6},{"source":"G Major Bebop","target":"G Acoustic","value":0.25329137978601635,"weight":0.25329137978601635,"alpha":0.6},{"source":"G Tritone Scale","target":"G Acoustic","value":0.253492070928503,"weight":0.253492070928503,"alpha":0.6},{"source":"G Acoustic","target":"G New Pentatonic","value":0.2784225260718372,"weight":0.2784225260718372,"alpha":0.45},{"source":"G Tritone Scale","target":"G - YOUR SCALE","value":0.2797647659866898,"weight":0.2797647659866898,"alpha":1},{"source":"G Harmonic Major","target":"G Double Harmonic Major","value":0.2885160509130181,"weight":0.2885160509130181,"alpha":0.45},{"source":"G Tritone Scale","target":"G Overtone","value":0.2920225390625001,"weight":0.2920225390625001,"alpha":0.6},{"source":"G Tritone Scale","target":"G Elektra (Chord)","value":0.31008337520401,"weight":0.31008337520401,"alpha":0.6},{"source":"G Acoustic","target":"G Elektra (Chord)","value":0.35154595454182735,"weight":0.35154595454182735,"alpha":0.6},{"source":"G Hirajoshi","target":"G Acoustic","value":0.35331746271141107,"weight":0.35331746271141107,"alpha":0.6},{"source":"G Lydian","target":"G Elektra (Chord)","value":0.35748571722807854,"weight":0.35748571722807854,"alpha":0.6},{"source":"G Lydian","target":"G Major Pentatonic","value":0.4065356093696862,"weight":0.4065356093696862,"alpha":0.45},{"source":"G Lydian","target":"G - YOUR SCALE","value":0.4071293402777777,"weight":0.4071293402777777,"alpha":1},{"source":"G Acoustic","target":"G - YOUR SCALE","value":0.4140082465277777,"weight":0.4140082465277777,"alpha":1},{"source":"G Major Bebop","target":"G Major Pentatonic","value":0.4220089285714285,"weight":0.4220089285714285,"alpha":0.45},{"source":"G Major Pentatonic","target":"G Bebop Dominant","value":0.4220089285714285,"weight":0.4220089285714285,"alpha":0.45},{"source":"G Bebop Dominant","target":"G Pentatonic Variation","value":0.4262740384615385,"weight":0.4262740384615385,"alpha":0.45},{"source":"G Lydian","target":"G Major Bebop","value":0.4343423835357992,"weight":0.4343423835357992,"alpha":0.6},{"source":"G Lydian","target":"G Bebop Dominant","value":0.4343423835357992,"weight":0.4343423835357992,"alpha":0.6},{"source":"G Elektra (Chord)","target":"G - YOUR SCALE","value":0.4362821767601172,"weight":0.4362821767601172,"alpha":1},{"source":"G Hirajoshi","target":"G - YOUR SCALE","value":0.43770175000337136,"weight":0.43770175000337136,"alpha":1},{"source":"G Major Pentatonic","target":"G Pentatonic Variation","value":0.45468749999999997,"weight":0.45468749999999997,"alpha":0.35},{"source":"G Acoustic","target":"G Bebop Dominant","value":0.4749213370987806,"weight":0.4749213370987806,"alpha":0.6},{"source":"G Ionian","target":"G Lydian","value":0.5095486111111112,"weight":0.5095486111111112,"alpha":0.6},{"source":"G Mixolydian","target":"G Acoustic","value":0.5095486111111112,"weight":0.5095486111111112,"alpha":0.6},{"source":"G Overtone","target":"G Hindu","value":0.5095486111111112,"weight":0.5095486111111112,"alpha":0.45},{"source":"G Lydian","target":"G Hirajoshi","value":0.5759369893557598,"weight":0.5759369893557598,"alpha":0.6},{"source":"G Ionian","target":"G - YOUR SCALE","value":0.59925,"weight":0.59925,"alpha":1},{"source":"G Major Bebop","target":"G - YOUR SCALE","value":0.605625,"weight":0.605625,"alpha":1},{"source":"G Bebop Dominant","target":"G - YOUR SCALE","value":0.605625,"weight":0.605625,"alpha":1},{"source":"G Mixolydian","target":"G - YOUR SCALE","value":0.6093749999999999,"weight":0.6093749999999999,"alpha":1},{"source":"G Double Harmonic Major","target":"G Phrygian Dominant","value":0.6840228247067156,"weight":0.6840228247067156,"alpha":0.6},{"source":"G Harmonic Major","target":"G Hindu","value":0.6840228247067156,"weight":0.6840228247067156,"alpha":0.35},{"source":"G Ionian","target":"G Mixolydian","value":0.6941253156562301,"weight":0.6941253156562301,"alpha":0.6},{"source":"G Lydian","target":"G Acoustic","value":0.6941253156562301,"weight":0.6941253156562301,"alpha":0.6},{"source":"G Mixolydian","target":"G Major Bebop","value":0.699032428029551,"weight":0.699032428029551,"alpha":0.6},{"source":"G Major Bebop","target":"G Bebop Dominant","value":0.7857142857142857,"weight":0.7857142857142857,"alpha":0.6},{"source":"G Ionian","target":"G Major Bebop","value":0.8524061768879738,"weight":0.8524061768879738,"alpha":0.6},{"source":"G Ionian","target":"G Bebop Dominant","value":0.8524061768879738,"weight":0.8524061768879738,"alpha":0.6},{"source":"G Mixolydian","target":"G Bebop Dominant","value":0.9320432373727348,"weight":0.9320432373727348,"alpha":0.6}],"modeDict":{"G - YOUR SCALE":{"label":"- YOUR SCALE","isUser":true,"type":0,"key":7,"name":"G - YOUR SCALE","n":[false,false,true,false,false,false,false,true,false,false,false,true],"c":[true,false,false,false,true,false,false,true,false,false,false,false],"aliases":[]},"G Ionian":{"isUser":false,"key":7,"type":1,"label":"Ionian","name":"G Ionian","c":[true,false,true,false,true,true,false,true,false,true,false,true],"n":[true,false,true,false,true,false,true,true,false,true,false,true]},"G Acoustic":{"isUser":false,"key":7,"type":2,"label":"Acoustic","name":"G Acoustic","c":[true,false,true,false,true,false,true,true,false,true,true,false],"n":[false,true,true,false,true,true,false,true,false,true,false,true]},"G Scottish":{"isUser":false,"key":7,"type":2,"label":"Scottish","name":"G Scottish","c":[true,false,true,false,false,true,false,true,false,true,false,false],"n":[true,false,true,false,true,false,false,true,false,true,false,false]},"G Tritone Scale":{"isUser":false,"key":7,"type":2,"label":"Tritone Scale","name":"G Tritone Scale","c":[true,true,false,false,true,false,true,true,false,false,true,false],"n":[false,true,true,false,false,true,false,true,true,false,false,true]},"G Lydian":{"isUser":false,"key":7,"type":1,"label":"Lydian","name":"G Lydian","c":[true,false,true,false,true,false,true,true,false,true,false,true],"n":[false,true,true,false,true,false,true,true,false,true,false,true]},"G Double Harmonic Major":{"isUser":false,"key":7,"type":2,"label":"Double Harmonic Major","name":"G Double Harmonic Major","c":[true,true,false,false,true,true,false,true,true,false,false,true],"n":[true,false,true,true,false,false,true,true,true,false,false,true]},"G Overtone":{"isUser":false,"key":7,"type":2,"label":"Overtone","name":"G Overtone","c":[true,false,true,false,true,false,true,true,true,false,true,false],"n":[false,true,true,true,false,true,false,true,false,true,false,true]},"G Elektra (Chord)":{"isUser":false,"key":7,"type":3,"label":"Elektra (Chord)","name":"G Elektra (Chord)","c":[true,true,false,false,true,false,false,true,false,true,false,false],"n":[false,false,true,false,true,false,false,true,true,false,false,true]},"G Major Bebop":{"isUser":false,"key":7,"type":2,"label":"Major Bebop","name":"G Major Bebop","c":[true,false,true,false,true,true,false,true,true,true,false,true],"n":[true,false,true,true,true,false,true,true,false,true,false,true]},"G Hirajoshi":{"isUser":false,"key":7,"type":2,"label":"Hirajoshi","name":"G Hirajoshi","c":[true,false,false,false,true,false,true,true,false,false,false,true],"n":[false,true,true,false,false,false,true,true,false,false,false,true]},"G Phrygian Dominant":{"isUser":false,"key":7,"type":2,"label":"Phrygian Dominant","name":"G Phrygian Dominant","c":[true,true,false,false,true,true,false,true,true,false,true,false],"n":[true,false,true,true,false,true,false,true,true,false,false,true]},"G Mixolydian":{"isUser":false,"key":7,"type":1,"label":"Mixolydian","name":"G Mixolydian","c":[true,false,true,false,true,true,false,true,false,true,true,false],"n":[true,false,true,false,true,true,false,true,false,true,false,true]},"G Bebop Dominant":{"isUser":false,"key":7,"type":2,"label":"Bebop Dominant","name":"G Bebop Dominant","c":[true,false,true,false,true,true,false,true,false,true,true,true],"n":[true,false,true,false,true,true,true,true,false,true,false,true]},"G Hindu":{"isUser":false,"key":7,"type":2,"label":"Hindu","name":"G Hindu","c":[true,false,true,false,true,true,false,true,true,false,true,false],"n":[true,false,true,true,false,true,false,true,false,true,false,true]},"G Major Pentatonic":{"isUser":false,"key":7,"type":2,"label":"Major Pentatonic","name":"G Major Pentatonic","c":[true,false,true,false,true,false,false,true,false,true,false,false],"n":[false,false,true,false,true,false,false,true,false,true,false,true]},"G New Pentatonic":{"isUser":false,"key":7,"type":2,"label":"New Pentatonic","name":"G New Pentatonic","c":[true,false,true,false,true,false,true,false,false,true,false,false],"n":[false,true,false,false,true,false,false,true,false,true,false,true]},"G Pentatonic Variation":{"isUser":false,"key":7,"type":2,"label":"Pentatonic Variation","name":"G Pentatonic Variation","c":[true,false,false,false,true,false,false,true,false,true,true,false],"n":[false,false,true,false,true,true,false,true,false,false,false,true]},"G Harmonic Major":{"isUser":false,"key":7,"type":1,"label":"Harmonic Major","name":"G Harmonic Major","c":[true,false,true,false,true,true,false,true,true,false,false,true],"n":[true,false,true,true,false,false,true,true,false,true,false,true]}}};
	createD3Graph(graph);
}

