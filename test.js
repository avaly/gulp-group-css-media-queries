'use strict';
const File = require('vinyl');
const gcmq = require('.');
const uvu = require('uvu')
const assert = require('uvu/assert')

uvu.test('should group css media queries', async () => {
	const stream = gcmq()
	const input = [
		'#a { display: block; }',
		'@media (min-width: 640px) { #b { float: left; } }',
		'@media (min-width: 1280px) { #c { float: left; } }',
		'@media (min-width: 640px) { #c { float: right; } }',
	].join('\n')
	const expected = [
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
	].join('\n')

	stream.on('data', function (file) {
		assert.is(file.relative, 'file.css');
		assert.is(file.contents.toString(), expected);
	});


	stream.write(new File({
		base: __dirname,
		path: __dirname + '/file.css',
		contents: Buffer.from(input)
	}));

	stream.end()

	await new Promise(resolve => stream.on('end', resolve))
});

uvu.test.run()
