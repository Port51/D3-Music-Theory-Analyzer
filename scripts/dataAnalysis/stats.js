"use strict";

var avg = (arr) => {
	let total = 0.0;
	for (let i = 0; i < arr.length; ++i) {
		total += Math.abs(arr[i]);
	}
	return total / arr.length;
}

var variance = (arr) => {
	let total = 0.0;
	for (let i = 0; i < arr.length; ++i) {
		total += arr[i] * arr[i];
	}
	return total / arr.length;
}