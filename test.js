'use strict';

const {execFile} = require('child_process');
const {join} = require('path');
const {promisify} = require('util');
const {unlink, writeFile} = require('fs').promises;

const executingNpmPath = require('.');
const test = require('tape');

const execFileOptions = {
	shell: process.platform === 'win32',
	timeout: 5000
};
const promisifiedExecFile = promisify(execFile);

test('test', async t => {
	t.equal(
		require(join(executingNpmPath, '..', '..', 'package.json')).name,
		'npm',
		'should return a path of npm CLI when the program is running inside npm.'
	);

	const tmp = join(__dirname, 'tmp.js');

	await writeFile(tmp, 'console.log(require("."))');
	delete process.env.npm_execpath;

	await Promise.all([
		(async () => t.equal(
			(await promisifiedExecFile('node', [tmp], execFileOptions)).stdout,
			'null\n',
			'should return null when the program isn\'t running inside a package manager.'
		))(),
		(async () => t.equal(
			(await promisifiedExecFile('yarn', ['--silent', 'test-yarn'], execFileOptions)).stdout,
			'null\n',
			'should return null when the program is running inside a non-npm package manager.'
		))()
	]);

	await unlink(tmp);

	t.end();
});
