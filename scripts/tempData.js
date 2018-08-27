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

