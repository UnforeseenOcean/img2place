'use strict';

const jimp = require('jimp');
const fs = require('fs');
const colors = [[255, 255, 255], [228, 228, 228],[136, 136, 136], [34, 34, 34], [255, 167, 209], [229, 0, 0], [229, 149, 0], [160, 106, 66], [229, 217, 0], [148, 224, 68], [2, 190, 1], [0, 211, 221], [0, 131, 199], [0, 0, 234], [207, 110, 228], [130, 0, 128]];

function dist(a, b) {
	var dif = 0;
	for (let k in a) {
		dif += Math.abs(a[k] - b[k]);
	}

	return dif;
}

jimp.read('input.png').then(function (image) {

	var transformed = [];

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
		//console.log(arguments);
		var red = this.bitmap.data[idx + 0];
		var green = this.bitmap.data[idx + 1];
		var blue = this.bitmap.data[idx + 2];
		var alpha = this.bitmap.data[idx + 3];

		var v = [red, green, blue];
		var sorted = colors.slice().sort((a, b) => dist(a, v) - dist(b, v));
		//console.log(v, sorted);

		transformed.push({
			idx: idx,
			x: x,
			y: y,
			color: colors.indexOf(sorted[0])
		});
	});

	//console.log(transformed);

	var w = image.bitmap.width;
	var h = image.bitmap.height;

	for (var v of transformed) {
		var c = colors[v.color];
		image.bitmap.data[v.idx + 0] = c[0];
		image.bitmap.data[v.idx + 1] = c[1];
		image.bitmap.data[v.idx + 2] = c[2];
		image.bitmap.data[v.idx + 3] = 0xff;
	}

	fs.writeFileSync('output.json', JSON.stringify(transformed.map(function (v) {
		return {
			x: v.x,
			y: v.y,
			color: v.color
		};
	})));

	image.write('output.png');

});