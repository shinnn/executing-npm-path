'use strict';

const {join} = require('path');

const path = process.env.npm_execpath;

module.exports = typeof path === 'string' && path.includes(join('node_modules', 'npm')) ? path : null;
