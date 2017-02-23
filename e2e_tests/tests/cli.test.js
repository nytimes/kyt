const shell = require('shelljs');
const path = require('path');

describe('KYT CLI', () => {
  beforeAll(() => {
    shell.mkdir('stage-cli');
    shell.cd('stage-cli');
  });

  window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;

  it('sets up a starter-kyt', () => {
    const exec = new Promise((resolve) => {
      const child = shell.exec('../packages/kyt-cli/index.js setup', (code, stdout) => {
        resolve({ code, output: stdout });
      });
      let skdone = false;
      let chooseDone = false;
      let ypmDone = false;
      child.stdout.on('data', (data) => {
        if (data.includes('Choose an installer')) {
          if (!ypmDone) {
            child.stdin.write('\n');
            ypmDone = true;
          }
        }
        if (data.includes('Enter a new directory name.')) {
          if (!skdone) {
            child.stdin.write('\n');
            skdone = true;
          }
        }
        if (data.includes('Choose a starter-kyt')) {
          if (!chooseDone) {
            child.stdin.write('\n');
            chooseDone = true;
          }
        }
      });
    });
    return exec.then((test) => {
      expect(test.code).toBe(0);
      const setupArr = test.output.split('\n');
      expect(setupArr.includes('👍  Added kyt scripts into your package.json scripts')).toBe(true);
      expect(setupArr.includes('👍  Added new dependencies to package.json')).toBe(true);
      expect(setupArr.includes('👍  Installed new modules')).toBe(true);
      expect(setupArr.includes('👍  Created .eslintrc.json file')).toBe(true);
      expect(setupArr.includes('👍  Created .stylelintrc.json file')).toBe(true);
      expect(setupArr.includes('👍  Created kyt.config.js file')).toBe(true);
      expect(setupArr.includes('👍  Created .editorconfig file')).toBe(true);
      expect(setupArr.includes('👍  Created .babelrc')).toBe(true);
      expect(setupArr.includes('👍  Created .gitignore file')).toBe(true);
      expect(setupArr.includes('👍  Created src directory')).toBe(true);
    });
  });

  it('sets up with the correct files', () => {
    expect(shell.test('-d', 'src')).toBe(true);
    expect(shell.test('-f', 'kyt.config.js')).toBe(true);
    expect(shell.test('-f', '.editorconfig')).toBe(true);
    expect(shell.test('-f', '.babelrc')).toBe(true);
    expect(shell.test('-f', '.eslintrc.json')).toBe(true);
    expect(shell.test('-f', '.stylelintrc.json')).toBe(true);
    expect(shell.test('-f', 'prototype.js')).toBe(true);
  });

  it('sets up the package json scripts', () => {
    // eslint-disable-next-line import/no-unresolved
    const userPackageJSON = require.requireActual(path.join(process.cwd(), 'package.json'));
    const scripts = userPackageJSON.scripts;
    expect(scripts.dev).toBe('kyt dev');
    expect(scripts.start).toBe('node build/server/main.js');
    expect(scripts.build).toBe('kyt build');
    expect(scripts.test).toBe('kyt test');
    expect(scripts.lint).toBe('npm run lint-script && npm run lint-style');
    expect(scripts['lint-style']).toBe('kyt lint-style');
    expect(scripts['lint-script']).toBe('kyt lint-script');
    expect(scripts.proto).toBe('kyt proto');
    expect(scripts['kyt:help']).toBe('kyt --help');
  });

  afterAll(() => {
    shell.cd('..');
    shell.rm('-rf', 'stage-cli');
  });
});
