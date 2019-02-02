"use strict";

// Add pairs, favoring higher scores
// Buckets are indices splitting the distribution into groups with score 0.9-1.0, 0.8-0.9, etc.
var addFilteredPairs = (pairs, buckets, numToUse) => {
	// Add imaginary bucket at end for easier calculations
	buckets.push(pairs.length);
	let filteredPairs = [];

	let bucketID = 0;
	for (let i = 0; i < numToUse; ++i) {
		
		let useBucketID = bucketID;
		let bucketSize = buckets[useBucketID + 1] - buckets[useBucketID];
		if (bucketSize <= 0) {
			// The bucket is empty!

			// Is there a better bucket available?
			// If our own index > 0, that means there must be buckets with items previous to us
			if (bucketID > 0 && buckets[bucketID] > 0) {
				// Choose next non-empty better bucket
				while (bucketSize <= 0) {
					useBucketID--;
					bucketSize = buckets[useBucketID + 1] - buckets[useBucketID];
				}
			} else {
				// Choose next non-empty worse bucket
				while (bucketSize <= 0) {
					useBucketID++;
					bucketSize = buckets[useBucketID + 1] - buckets[useBucketID];
				}
			}
		}

		// Sample from bucket
		let localSample = 0;
		if (i < 10) {
			// Always choose the max item from each bucket first
			localSample = 0;
		} else {
			// Choose randomly
			localSample = parseInt(Math.floor(Math.random() * bucketSize));
		}

		// Translate into item id
		const itemID = buckets[useBucketID] + localSample;

		if (pairs[itemID]) {
			// Add to pairs
			filteredPairs.push(pairs[itemID]);

			// Remove from pairs
			pairs.splice(itemID, 1);
		} else {
			console.log("ERROR: Bucket overflow");
		}

		// Shift all bucket indices
		for (let j = useBucketID + 1; j < buckets.length; ++j) {
			buckets[j] -= 1;
		}

		bucketID = (bucketID + 1) % 10;
	}

	return filteredPairs;
}

// Filters out identical modes
// Stores them as aliases within other modes so they can be displayed later
var filterIdenticalModes = (modes) => {
	let used = {}; // key = notes, val = id of parent
	let uniqueModes = []; // list of filtered modes
	for (let i = 0; i < modes.length; ++i) {
		if (modes[i].isUser) {
			// User modes are always kept separate
			uniqueModes.push(modes[i]);
		} else {
			const key = repNotesAsString(-1, modes[i].c);
			if (!(key in used)) {
				// I am the first mode discovered with this NOTES_IN_SCALE
				// Save this ID
				used[key] = uniqueModes.length;

				// Use in final dataset
				uniqueModes.push(modes[i]);
			} else {
				// There's already an identical key
				// So add myself to that mode's aliases
				const parent = parseInt(used[key]);
				uniqueModes[parent].aliases.push(modes[i].label);
			}
		}
	}
	console.log("Filtered for unique modes, reducing dataset from size " + modes.length.toString() + " to " + uniqueModes.length.toString());

	return uniqueModes;
}