var assert = require('assert');
var fs = require('fs');
var path = require('path');

var helloWorldMin = path.join(__dirname, '../tmp/hello-world.min.js');
var map = path.join(__dirname, '../tmp/hello-world.min.json');

describe('grunt minifyify', function() {
	it('should produce a hello world bundle', function(done) {
		fs.readFile(helloWorldMin, done);
	});
	it('should produce a sourcemap', function(done) {
		fs.readFile(map, done);
	});
	it('should say hi', function() {
		require(helloWorldMin);
		assert.equal(global.hello(), 'hello world');
	});
});