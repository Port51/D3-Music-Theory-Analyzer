"use strict";

var getTempString = () => {
	return "Ionian						[# # ## # # #]" +
	"Dorian						[# ## # # ## ]" +
	"Phrygian					[## # # ## # ]" +
	"Lydian						[# # # ## # #]" +
	"Mixolydian					[# # ## # ## ]" +
	"Aeolian						[# ## # ## # ]" +
	"Locrian						[## # ## # # ]" +
	"Harmonic Minor				[# ## # ##  #]" +
	"Melodic Minor				[# ## # # # #]" +
	"Harmonic Major				[# # ## ##  #]" +
	"Dorian #4					[# ##  ## ## ]" +
	"Whole Tone Scale			[# # # # # # ]" +
	"Chromatic					[############]" +
	"Lydian #9					[#  ## ## # #]" +
	"Double Harmonic Major		[##  ## ##  #]" +
	"Scriabin					[# # # #  ## ]" +
	"Mystic Minor				[## # # # ## ]" +
	"Altered Scale				[## ## # # # ]" +
	"Blues						[# ## ###  # ]" +
	"Enigmatic					[##  # # # ##]" +
	"Flamenco					[##  ## ##  #]" +
	"Gypsy						[# ##  ### # ]" +
	"Half Diminished				[# ##  # # # ]" +
	"Hirajoshi					[#   # ##   #]" +
	"Hungarian Minor				[# ##  ###  #]" +
	"In Scale					[##   # ##  #]" +
	"Insen Scale					[##   # #  # ]" +
	"Istrian						[## ## #   # ]" +
	"Iwato						[##   ##   # ]" +
	"Lydian Augmented			[# # # # ## #]" +
	"Major Bebop					[# # ## ### #]" +
	"Major Locrian (Arabian)		[# # ### # # ]" +
	"Major Pentatonic			[# # #  # #  ]" +
	"Chinese						[# # #  # #  ]" +
	"Minor Pentatonic			[#  # # #  # ]" +
	"Neapolitan Major			[## # # # # #]" +
	"Neapolitan Minor			[## # # ##  #]" +
	"Pelog (approx)				[## #  ### # ]" +
	"Persian						[##  ### #  #]" +
	"Pfluke Scale				[# ##  ## # #]" +
	"Phrygian Dominant			[##  ## ## # ]" +
	"Prometheus					[# # # #  ## ]" +
	"Tritone Scale				[##  # ##  # ]" +
	"Urkainian Dorian			[# ##  ## ## ]" +
	"Yo Scale					[#  # # #  # ]" +
	"Acoustic					[# # # ## ## ]" +
	"Bebop Dominant				[# # ## # ###]" +
	"New Pentatonic				[# # # #  #  ]" +
	"Pentatonic (Japan)			[##   # ##   ]" +
	"Pentatonic (Balinese)		[##   ## #   ]" +
	"Pentatonic (Pelog)			[## #   #  # ]" +
	"Hemitonic Pentatonic 3		[# ##   #   #]" +
	"Pentatonic Variation		[#   #  # ## ]" +
	"Harmonic Minor Dom 7th		[#  #   #   #]" +
	"Melodic Minor Dom 7th		[#  # #   #  ]" +
	"Esoteric 6th				[  #  #   # #]" +
	"Augmented					[#  ##  ##  #]" +
	"Diminished					[# ## ## ## #]" +
	"Gypsy (Byzantine)			[##  ## ##  #]" +
	"Spanish (8 tone)			[## #### # # ]" +
	"Hungarian Gypsy				[# ##  ### # ]" +
	"Native American				[# # # #  # #]" +
	"Hungarian Folk				[##  #  ##  #]" +
	"Leading Tone				[# # # # # ##]" +
	"Overtone					[# # # ### # ]" +
	"Hindu						[# # ## ## # ]" +
	"Spanish Gypsy				[##  ## ## # ]" +
	"Arabian						[# # ### # # ]" +
	"Oriental					[##  ###  ## ]" +
	"Gypsy Minor					[# ##  ### # ]" +
	"Javanese					[## # # # ## ]" +
	"Scottish					[# #  # # #  ]" +
	"Kumoi						[##   # ##   ]" +
	"Egyptian					[# #  # #  # ]" +
	"Yo							[#  # # #  # ]" +
	"Hirojoshi					[# ##   ##   ]" +
	"Balinese					[## #   ##   ]" +
	"Mongolian					[# # #  # #  ]" +
	"Ryo							[# # #  # #  ]" +
	"Mystic						[# # # #  ## ]" +
	"Bebop Dorian				[# ## # # ###]" +
	"Antagonism					[## #  ## #  ]" +
	"Vader Theme					[#  #   ##  #]";
}

var getTempData = () => {
	const str = getTempString();
	const spl = str.split(/\[|\]/);

	let i = 0;
	let modes = [];
	while (i * 2 + 1 < spl.length) {
		let mode = {};
		mode.label = spl[i * 2 + 0].trim();
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

