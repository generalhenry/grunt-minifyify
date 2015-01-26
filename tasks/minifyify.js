var fs = require('fs');
var async = require('async');
var browserify = require('browserify');

module.exports = function (grunt) {
	grunt.registerMultiTask(
		'minifyify',
		'Produces minified bundles with source maps.',
		function() {
			async.eachSeries(this.data, function(file, done) {
				var bundler = new browserify({debug: true});
				bundler.add(file.src);
				bundler.plugin('minifyify', {map: file.dest.mapName});
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