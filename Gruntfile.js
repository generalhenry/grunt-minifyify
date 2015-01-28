module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		minifyify: {
			files: [{
				add: './hello-world.js',
				dest: {
					buildFile: 'tmp/hello-world.min.js',
					mapFile: 'tmp/hello-world.min.json',
				},
				minifyifyOptions: {
					map: 'hello-world.min.json'
				},
				browserifyOptions: {
					basedir: 'test/fixtures'
				}
			}]
		}
	});

	grunt.loadTasks('tasks');
};