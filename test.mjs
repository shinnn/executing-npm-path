import {execFile} from 'child_process';
import {fileURLToPath} from 'url';
import {join} from 'path';
import {promisify} from 'util';

import executingNpmPath from '.';
import test from 'tape';
import yarnPackageJson from 'yarn/package.json';

const execFileOptions = {
	env: {},
	timeout: 5000
};
const execNode = promisify(execFile).bind(null, process.execPath);

test('test', async t => {
	t.equal(
		(await import(join(executingNpmPath, '..', '..', 'package.json'))).default.name,
		'npm',
		'should return a path of npm CLI when the program is running inside npm.'
	);

	await Promise.all([
		(async () => t.equal(
			(await execNode(['-p', 'require(".")'], execFileOptions)).stdout,
			'null\n',
			'should return null when the program isn\'t running inside a package manager.'
		))(),
		(async () => t.equal(
			(await execNode([
				join(fileURLToPath(new URL('node_modules/yarn', import.meta.url)), yarnPackageJson.bin.yarn),
				'--silent',
				'run-yarn'
			], execFileOptions)).stdout,
			'null\n',
			'should return null when the program is running inside a non-npm package manager.'
		))()
	]);

	t.end();
});
