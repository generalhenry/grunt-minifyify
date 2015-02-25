var brfs = require('brfs');
module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		minifyify: {
			test: {
				inputFolder: 'test/fixtures',
				entryFile: 'hello-world',
				name: 'hello-world',
				transform: brfs
			},
			options: {
				ignore: ['grunt', 'grunt-cli'],
				exclude: ['browserify', 'minifyify'],
				external: 'chalk',
				require: 'async',
				minifiedExt: '.min.js',
				mapExt: '.min.json',
				outputFolder: 'tmp'
			}
		}
	});

	grunt.loadTasks('tasks');
};