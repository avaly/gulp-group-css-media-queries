'use strict';
var PluginError = require('plugin-error');
var through = require('through2');
var gcmq = require('group-css-media-queries');
var applySourceMap = require('vinyl-sourcemaps-apply');

module.exports = function () {
	return through.obj(function (file, enc, cb) {
		// generate source maps if plugin source-map present
		if (file.sourceMap) {
			options.makeSourceMaps = true;
		}
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new PluginError('gulp-group-css-media-queries', 'Streaming not supported'));
			return cb();
		}

		try {
			file.contents = new Buffer(gcmq(file.contents.toString()));
			// apply source map to the chain
			if (file.sourceMap) {
				applySourceMap(file, result.map);
			}
		} catch (err) {
			this.emit('error', new PluginError('gulp-group-css-media-queries', err));
		}

		this.push(file);
		cb();
	});
};
