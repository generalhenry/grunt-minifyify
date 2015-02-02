var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var chalk = require('chalk');
var browserify = require('browserify');
var minifyify = require('minifyify');

module.exports = function (grunt) {
	grunt.registerMultiTask(
		'minifyify',
		'Produces minified bundles with source maps.',
		function() {
			async.eachSeries(this.files, function(file, done) {
				var bundler = new browserify(_.extend({
					debug: true
				}, file.browserifyOptions));
				[
					'ignore',
					'exclude',
					'external',
					'require',
					'add'
				].forEach(function (type) {
					if (Array.isArray(file[type])) {
						file[type].forEach(bundler[type], bundler);
					} else if (file[type]) {
						bundler[type](file[type]);
					}
				});
				if (file.src) {
					grunt.fail.warn(new Error('file.src is deprecated.' +
						'Use file.add instead.'));
					bundler.add(file.src);
				}
				bundler.plugin(minifyify, file.minifyifyOptions);
				bundler.bundle(function(err, src, map) {
					if (err) {
						done(err);
					} else {
						grunt.file.write(file.dest.buildFile, src);
						grunt.file.write(file.dest.mapFile, map)
						grunt.log.ok('Minifyified ' + file.dest.buildFile + ', ' + file.dest.mapFile);
					}
				});
			}, this.async());
		}
	);
};