var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var browserify = require('browserify');
var minifyify = require('minifyify');

module.exports = function (grunt) {
	grunt.registerMultiTask(
		'minifyify',
		'Produces minified bundles with source maps.',
		function() {
			async.eachSeries(this.data, function(file, done) {
				var bundler = new browserify(_.extend({
					debug: true
				}, file.browserifyOptions));
				bundler.add(file.src);
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