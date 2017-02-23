const shell = require('shelljs');
const path = require('path');
const kill = require('../utils/psKill');
const ypm = require('../../packages/kyt-cli/utils/yarnOrNpm')();

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

  it('runs the tests command', () => {
    const output = shell.exec(`${ypm} run test`);
    expect(output.code).toBe(0);
  });

  it('runs the build command', () => {
    const output = shell.exec(`${ypm} run build`);
    expect(output.code).toBe(0);
    expect(shell.test('-d', 'build')).toBe(true);
    expect(shell.test('-d', 'build/server')).toBe(true);
    expect(shell.test('-f', 'build/publicAssets.json')).toBe(true);
    expect(shell.test('-d', 'build/public')).toBe(true);
  });

  it('runs the build command and exits on SIGINT', () => {
    const exec = new Promise((resolve, reject) => {
      let sentKill = false;
      let finishedBuild = false;
      const child = shell.exec(`${ypm} run build`, () => {
        resolve(finishedBuild);
      });
      child.stdout.on('data', (data) => {
        if (data.includes('✅ Done building')) {
          finishedBuild = true;
          reject('Unexpected build finish');
        }
        if (!sentKill) {
          sentKill = true;
          kill(child.pid, 'SIGINT');
        }
      });
    });
    return exec.then(finishedBuild => expect(finishedBuild).toBe(false));
  });

  it('runs the dev command and exits on SIGINT', () => {
    const exec = new Promise((resolve, reject) => {
      let sentKill = false;
      let finishedBuild = false;
      const child = shell.exec(`${ypm} run dev`, () => {
        resolve(finishedBuild);
      });
      child.stdout.on('data', (data) => {
        if (data.includes('✅ Development started')) {
          finishedBuild = true;
          reject('Unexpected build finish');
        }
        if (!sentKill) {
          sentKill = true;
          kill(child.pid, 'SIGINT');
        }
      });
    });
    return exec.then(finishedBuild => expect(finishedBuild).toBe(false));
  });
  // eslint-disable-next-line
  window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;

  it('starts the app', () => {
    let testPass;
    shell.exec(`${ypm} run build`);
    const exec = new Promise((resolve) => {
      const child = shell.exec(`${ypm} run start`, () => {
        resolve(testPass);
      });
      child.stdout.on('data', (data) => {
        if (data.includes('node build/server/main.js')) {
          shell.exec('sleep 3');
          const output = shell.exec('curl -I localhost:3000');
          testPass = output.stdout.includes('200');
          kill(child.pid);
        }
      });
    });
    return exec.then(test => expect(test).toBe(true));
  });


  it('dev', () => {
    let testPass;
    const exec = new Promise((resolve) => {
      const child = shell.exec(`${ypm} run dev`, () => {
        resolve(testPass);
      });
      child.stdout.on('data', (data) => {
        if (data.includes('✅  Development started')) {
          shell.exec('sleep 5');
          const output = shell.exec('curl -I localhost:3000');
          testPass = output.stdout.includes('200');
          kill(child.pid);
        }
      });
    });
    return exec.then(test => expect(test).toBe(true));
  });

  it('proto', () => {
    const exec = new Promise((resolve) => {
      let testPass;
      const child = shell.exec(`${ypm} run proto`, () => {
        resolve(testPass);
      });
      let stillAlive = true;
      child.stdout.on('data', (data) => {
        if (data.includes('✅  webpack-dev-server http://localhost:3002/prototype') && stillAlive) {
          stillAlive = false;
          shell.exec('sleep 5');
          const output = shell.exec('curl -I localhost:3002/prototype/');
          testPass = output.stdout.includes('404');
          kill(child.pid);
        }
      });
    });
    return exec.then(test => expect(test).toBe(true));
  });

  afterAll(() => {
    shell.cd('..');
    shell.rm('-rf', 'stage-cli');
  });
});
