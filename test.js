'use strict';

const {join} = require('path');
const {unlink, writeFile} = require('fs').promises;

const executingNpmPath = require('.');
const getStdout = require('execa').stdout;
const test = require('tape');

test('test', async t => {
	t.equal(
		require(join(executingNpmPath, '..', '..', 'package.json')).name,
		'npm',
		'should return a path of npm CLI when the program is running inside npm.'
	);

	const tmp = join(__dirname, 'tmp.js');

	await writeFile(tmp, 'console.log(require("."))');

	await Promise.all([
		(async () => t.equal(
			await getStdout('node', [tmp], {extendEnv: false}),
			'null',
			'should return null when the program isn\'t running inside a package manager.'
		))(),
		(async () => t.equal(
			await getStdout('yarn', ['--silent', 'test-yarn'], {extendEnv: false}),
			'null',
			'should return null when the program is running inside a non-npm package manager.'
		))()
	]);

	await unlink(tmp);

	t.end();
});
