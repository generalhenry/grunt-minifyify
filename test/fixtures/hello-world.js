var fs = require('fs');
module.exports = global.hello = function() {
	return fs.readFileSync(__dirname + '/hello.txt', 'utf-8');
};
