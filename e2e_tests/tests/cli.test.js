const path = require('path');
const shell = require('shelljs');

const pkgJsonPath = path.join(__dirname, './../pkg.json');

describe('Installation and Setup', () => {
  it('installs', () => {
    if (shell.test('-d', 'cli-test')) {
      shell.rm('-rf', 'cli-test');
    }
    shell.mkdir('cli-test');
    shell.cd('cli-test');
    shell.cp(pkgJsonPath, 'package.json');
    const output = shell.exec('npm install');
    if (output.code !== 0) {
      process.exit();
    }

    expect(shell.test('-f', 'package.json')).toBe(true);
    expect(shell.test('-d', 'node_modules')).toBe(true);
  });
  it('sets up the default starter-kyt', () => {
    const output = shell.exec('node_modules/.bin/kyt setup -r git@github.com:nytm/wf-kyt-starter-test.git');
    expect(output.code).toBe(0);
    const setupArr = output.stdout.split('\n');
    expect(setupArr.includes('🔥  Setting up starter-kyt')).toBe(true);
    expect(setupArr.includes('👍  Added kyt scripts into your package.json scripts')).toBe(true);
    expect(setupArr.includes('👍  Added new dependencies to package.json')).toBe(true);
    expect(setupArr.includes('👍  Installed new modules')).toBe(true);
    expect(setupArr.includes('👍  Created .eslintrc.json file')).toBe(true);
    expect(setupArr.includes('👍  Created .stylelintrc.json file')).toBe(true);
    expect(setupArr.includes('👍  Created kyt.config.js file')).toBe(true);
    expect(setupArr.includes('👍  Created .editorconfig file')).toBe(true);
    expect(setupArr.includes('👍  Created .gitignore file')).toBe(true);
    expect(setupArr.includes('👍  Created src directory')).toBe(true);
  });
  it('sets up with the correct file', () => {
    expect(shell.test('-d', 'src')).toBe(true);
    expect(shell.test('-f', 'kyt.config.js')).toBe(true);
    expect(shell.test('-f', '.editorconfig')).toBe(true);
    expect(shell.test('-f', '.eslintrc.json')).toBe(true);
    expect(shell.test('-f', '.stylelintrc.json')).toBe(true);
    expect(shell.test('-f', 'prototype.js')).toBe(true);
  });
  it('sets up the package json scripts', () => {
    // eslint-disable-next-line import/no-unresolved
    const userPackageJSON = require.requireActual('../../cli-test/package.json');
    const scripts = userPackageJSON.scripts;
    expect(scripts.dev).toBe('kyt dev');
    expect(scripts.build).toBe('kyt build');
    expect(scripts.test).toBe('kyt test');
    expect(scripts.lint).toBe('kyt lint');
    expect(scripts['lint-style']).toBe('kyt lint-style');
    expect(scripts.proto).toBe('kyt proto');
    expect(scripts['kyt:help']).toBe('kyt --help');
  });

  it('runs the lint command', () => {
    expect(true).toBe(true);
    const output = shell.exec('npm run lint');
    expect(output.code).toBe(0);
    const outputArr = output.stdout.split('\n');
    expect(outputArr.includes('✅  Your JS looks great ✨')).toBe(true);
  });

  it('runs the lint-style command', () => {
    const output = shell.exec('node_modules/.bin/kyt lint-style');
    expect(output.code).toBe(0);
    const outputArr = output.stdout.split('\n');
    expect(outputArr.includes('✅  Your styles look good! ✨')).toBe(true);
  });

  it('runs the tests command', () => {
    const output = shell.exec('npm run test');
    expect(output.code).toBe(0);
  });

  it('runs the build command', () => {
    const output = shell.exec('npm run build');
    expect(output.code).toBe(0);
    expect(shell.test('-d', 'build')).toBe(true);
    expect(shell.test('-d', 'build/server')).toBe(true);
    expect(shell.test('-f', 'build/publicAssets.json')).toBe(true);
    expect(shell.test('-d', 'build/public')).toBe(true);
  });

  afterAll(() => {
    shell.cd('..');
    shell.rm('-rf', 'cli-test');
  });
});
