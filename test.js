'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var gcmq = require('./index');

it('should group css media queries', function (cb) {
	var stream = gcmq(),
		input = [
			'#a { display: block; }',
			'@media (min-width: 640px) { #b { float: left; } }',
			'@media (min-width: 1280px) { #c { float: left; } }',
			'@media (min-width: 640px) { #c { float: right; } }',
		].join('\n'),
		expected = [
			'#a {',
			'  display: block;',
			'}',
			'',
			'@media (min-width: 640px) {',
			'  #b {',
			'    float: left;',
			'  }',
			'',
			'  #c {',
			'    float: right;',
			'  }',
			'}',
			'',
			'@media (min-width: 1280px) {',
			'  #c {',
			'    float: left;',
			'  }',
			'}',
		].join('\n');

	stream.on('data', function (file) {
		assert.equal(file.relative, 'file.css');
		assert.equal(file.contents.toString(), expected);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/file.css',
		contents: new Buffer(input)
	}));

	stream.end();
});
