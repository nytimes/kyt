const shell = require('shelljs');
const path = require('path');

let rootPath;
shell.config.silent = false;
describe('KYT CLI', () => {
  beforeAll(() => {
    shell.mkdir('stage-cli');
    shell.cd('stage-cli');
    rootPath = path.resolve(process.cwd());
  });

  // Checks for all basic files
  const baseFileCheck = () => {
    it('sets up with the correct files', () => {
      expect(shell.test('-d', 'src')).toBe(true);
      expect(shell.test('-f', 'kyt.config.js')).toBe(true);
      expect(shell.test('-f', '.editorconfig')).toBe(true);
      expect(shell.test('-f', '.babelrc')).toBe(true);
      expect(shell.test('-f', '.eslintrc.json')).toBe(true);
      expect(shell.test('-f', '.stylelintrc.json')).toBe(true);
      expect(shell.test('-f', 'prototype.js')).toBe(true);
    });
  };
  // Checks to make sure package.json recieves correct script
  const packageScripts = () => {
    it('sets up the package json scripts', () => {
      const userPackageJSON = require.requireActual(path.join(process.cwd(), 'package.json'));
      // eslint-disable-next-line import/no-unresolved
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
  };
  // Checks setup command output
  const outputCheck = setupArr => {
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
  };

  window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;

  describe('setup for universal starter-kyt', () => {
    it('sets up a universal starter-kyt', () => {
      const exec = new Promise(resolve => {
        const child = shell.exec('../packages/kyt-cli/index.js setup', (code, stdout) => {
          resolve({ code, output: stdout });
        });
        let skdone = false;
        let chooseDone = false;
        let ypmDone = false;
        child.stdout.on('data', data => {
          if (data.includes('Choose an installer')) {
            if (!ypmDone) {
              child.stdin.write('\n');
              ypmDone = true;
            }
          }
          if (data.includes('Enter a new directory name.')) {
            if (!skdone) {
              child.stdin.write('standard-starter\n');
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
      return exec.then(test => {
        shell.cd('standard-starter');
        expect(test.code).toBe(0);
        const setupArr = test.output.split('\n');
        outputCheck(setupArr);
      });
    });
    baseFileCheck();
    packageScripts();
    it('verifies the source directory', () => {
      expect(shell.test('-d', 'src/client')).toBe(true);
      expect(shell.test('-d', 'src/server')).toBe(true);
      expect(shell.test('-f', 'src/client/index.js')).toBe(true);
      expect(shell.test('-f', 'src/server/index.js')).toBe(true);
    });
  });

  describe('setup for static starter-kyt', () => {
    it('sets up a static starter-kyt', () => {
      const exec = new Promise(resolve => {
        shell.cd(rootPath);
        const child = shell.exec('../packages/kyt-cli/index.js setup', (code, stdout) => {
          resolve({ code, output: stdout });
        });
        let skdone = false;
        let chooseDone = false;
        let ypmDone = false;
        child.stdout.on('data', data => {
          if (data.includes('Choose an installer')) {
            if (!ypmDone) {
              child.stdin.write('\n');
              ypmDone = true;
            }
          }
          if (data.includes('Enter a new directory name.')) {
            if (!skdone) {
              child.stdin.write('static-starter\n');
              skdone = true;
            }
          }
          if (data.includes('Choose a starter-kyt')) {
            if (!chooseDone) {
              child.stdin.write('\\027[B\n');
              chooseDone = true;
            }
          }
        });
      });
      return exec.then(test => {
        shell.cd('static-starter');
        expect(test.code).toBe(0);
        const setupArr = test.output.split('\n');
        outputCheck(setupArr);
      });
    });
    baseFileCheck();
    packageScripts();
    it('verifies the source directory', () => {
      expect(shell.test('-d', 'src/client')).toBe(true);
      expect(shell.test('-d', 'src/server')).toBe(false);
      expect(shell.test('-f', 'src/client/index.js')).toBe(true);
    });
  });

  describe('setup for starter-kyt from git repo', () => {
    it('sets up a static starter-kyt', () => {
      const exec = new Promise(resolve => {
        shell.cd(rootPath);
        const child = shell.exec('../packages/kyt-cli/index.js setup', (code, stdout) => {
          resolve({ code, output: stdout });
        });
        let skdone = false;
        let chooseDone = false;
        let ypmDone = false;
        let repoDone = false;
        child.stdout.on('data', data => {
          if (data.includes('Choose an installer')) {
            if (!ypmDone) {
              child.stdin.write('\n');
              ypmDone = true;
            }
          }
          if (data.includes('Enter a new directory name.')) {
            if (!skdone) {
              child.stdin.write('git-starter\n');
              skdone = true;
            }
          }
          if (data.includes('Choose a starter-kyt')) {
            if (!chooseDone) {
              child.stdin.write('\\027[B\\027[B\n');
              chooseDone = true;
            }
          }
          if (data.includes('Enter your Repo URL (https or ssh)')) {
            if (!repoDone) {
              child.stdin.write('https://github.com/NYTimes/kyt-starter-test.git\n');
              repoDone = true;
            }
          }
        });
      });
      return exec.then(test => {
        shell.cd('git-starter');
        expect(test.code).toBe(0);
        const setupArr = test.output.split('\n');
        outputCheck(setupArr);
      });
    });
    baseFileCheck();
    packageScripts();
    it('verifies the source directory', () => {
      expect(shell.test('-d', 'src/client')).toBe(true);
      expect(shell.test('-d', 'src/server')).toBe(false);
      expect(shell.test('-f', 'src/client/index.js')).toBe(true);
    });
  });

  describe('setup for starter-kyt from a local path', () => {
    it('sets up a static starter-kyt', () => {
      const exec = new Promise(resolve => {
        shell.cd(rootPath);
        const localPath = path.resolve(rootPath, '../packages/kyt-starter-universal/starter-src');
        const child = shell.exec(
          `../packages/kyt-cli/index.js setup --local-path ${localPath}`,
          (code, stdout) => {
            resolve({ code, output: stdout });
          }
        );
        let skdone = false;
        let ypmDone = false;
        child.stdout.on('data', data => {
          if (data.includes('Choose an installer')) {
            if (!ypmDone) {
              child.stdin.write('\n');
              ypmDone = true;
            }
          }
          if (data.includes('Enter a new directory name.')) {
            if (!skdone) {
              child.stdin.write('local-starter\n');
              skdone = true;
            }
          }
        });
      });
      return exec.then(test => {
        shell.cd('local-starter');
        expect(test.code).toBe(0);
        const setupArr = test.output.split('\n');
        outputCheck(setupArr);
      });
    });
    baseFileCheck();
    packageScripts();
    it('verifies the source directory', () => {
      expect(shell.test('-d', 'src/client')).toBe(true);
      expect(shell.test('-d', 'src/server')).toBe(true);
      expect(shell.test('-f', 'src/client/index.js')).toBe(true);
      expect(shell.test('-f', 'src/server/index.js')).toBe(true);
    });
  });

  afterAll(() => {
    shell.cd('../..');
    shell.rm('-rf', 'stage-cli');
  });
});
