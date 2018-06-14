'use strict';

const {join} = require('path');

const path = process.env.npm_execpath;

if (typeof path === 'string' && path.includes(join('node_modules', 'npm'))) {
	module.exports = path;
} else {
	module.exports = null;
}
