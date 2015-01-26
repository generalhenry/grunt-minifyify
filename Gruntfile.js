module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		minifyify: {
			files: [{
				src: './test/fixtures/hello-world.js',
				dest: {
					buildFile: 'tmp/hello-world.min.js',
					mapFile: 'tmp/hello-world.min.json',
					mapName: 'hello-world.min.json'
				}
			}]
		}
	});

	grunt.loadTasks('tasks');
};