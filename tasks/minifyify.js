var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var async = require('async');
var chalk = require('chalk');
var browserify = require('browserify');
var minifyify = require('minifyify');
var aliasify = require('aliasify');

module.exports = function (grunt) {
	grunt.registerMultiTask(
		'minifyify',
		'Produces minified bundles with source maps.',
		function() {
			var options = this.options({});
			var data = this.data;
			var minifiedExt = data.minifiedExt || options.minifiedExt || '.min.js';
			var mapExt = data.mapExt || options.mapExt || '.min.json';
			var inputFolder = data.inputFolder || options.inputFolder;
			var outputFolder = data.outputFolder || options.outputFolder;
			var aliasifyOptions = _.extend({}, options.aliasifyOptions, data.aliasifyOptions);
			if (data.name) {
				var file = {};
				[
					'browserifyOptions',
					'minifyifyOptions'
				].forEach(function (name) {
					file[name] = _.extend({}, data[name], options[name]);
				});
				[
					'ignore',
					'exclude',
					'external',
					'require',
					'add'
				].forEach(function (type) {
					file[type] = [].concat(data[type] || []).concat(options[type] || []);
				});
				file.add.push('./' + path.join(inputFolder, data.entryFile || data.name) + '.js');
				file.minifyifyOptions.map = data.name + mapExt;
				file.minifyifyOptions.compressPath = outputFolder;
				file.dest = {
					buildFile: path.join(outputFolder, data.name) + minifiedExt,
					mapFile: path.join(outputFolder, data.name) + mapExt
				};
				this.files.push(file);
			}
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
				if (aliasifyOptions.aliases) {
					bundler.transform(aliasify.configure(aliasifyOptions));
				}
				bundler.bundle(function(err, src, map) {
					if (err) {
						done(err);
					} else {
						grunt.file.write(file.dest.buildFile, src);
						grunt.file.write(file.dest.mapFile, map)
						grunt.log.ok('Minifyified ' + file.dest.buildFile + ', ' + file.dest.mapFile);
						done();
					}
				});
			}, this.async());
		}
	);
};