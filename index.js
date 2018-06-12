'use strict';

var join = require('path').join;

var path = process.env.npm_execpath;

if (typeof path === 'string' && path.indexOf(join('node_modules', 'npm')) !== -1) {
	module.exports = path;
} else {
	module.exports = null;
}
