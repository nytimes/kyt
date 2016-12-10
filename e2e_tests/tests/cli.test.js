const path = require('path');
const shell = require('shelljs');
const kill = require('../utils/psKill');

const pkgJsonPath = path.join(__dirname, './../pkg.json');

describe('KYT CLI', () => {
  it('installs kyt', () => {
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
  it('sets up a starter-kyt', () => {
    const setupURL = 'https://github.com/NYTimes/kyt-starter-test.git';
    const output = shell.exec(`node_modules/.bin/kyt-cli setup -r ${setupURL}`);
    expect(output.code).toBe(0);
    const setupArr = output.stdout.split('\n');
    expect(setupArr.includes('🔥  Setting up your new kyt project...')).toBe(true);
    expect(setupArr.includes('👍  Setting up the specified starter-kyt')).toBe(true);
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
  it('sets up with the correct files', () => {
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
    expect(scripts.start).toBe('node build/server/main.js');
    expect(scripts.build).toBe('kyt build');
    expect(scripts.test).toBe('kyt test');
    expect(scripts.lint).toBe('npm run lint-script && npm run lint-style');
    expect(scripts['lint-style']).toBe('kyt lint-style');
    expect(scripts['lint-script']).toBe('kyt lint-script');
    expect(scripts.proto).toBe('kyt proto');
    expect(scripts['kyt:help']).toBe('kyt --help');
  });

  it('runs the lint command', () => {
    expect(true).toBe(true);
    const output = shell.exec('npm run lint-script');
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

  it('runs the build command and exits on SIGINT', () => {
    const exec = new Promise((resolve, reject) => {
      let sentKill = false;
      let finishedBuild = false;
      const child = shell.exec('npm run build', () => {
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
      const child = shell.exec('npm run dev', () => {
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
    shell.exec('npm run build');
    const exec = new Promise((resolve) => {
      const child = shell.exec('npm run start', () => {
        resolve(testPass);
      });
      child.stdout.on('data', (data) => {
        if (data.includes('node build/server/main.js')) {
          shell.exec('sleep 3');
          const output = shell.exec('curl -I localhost:3100');
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
      const child = shell.exec('npm run dev', () => {
        resolve(testPass);
      });
      child.stdout.on('data', (data) => {
        if (data.includes('✅  Development started')) {
          shell.exec('sleep 2');
          const output = shell.exec('curl -I localhost:3100');
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
      const child = shell.exec('npm run proto', () => {
        resolve(testPass);
      });
      let stillAlive = true;
      child.stdout.on('data', (data) => {
        if (data.includes('webpack: bundle is now VALID.') && stillAlive) {
          stillAlive = false;
          shell.exec('sleep 5');
          const output = shell.exec('curl -I localhost:3102/prototype/');
          testPass = output.stdout.includes('404');
          kill(child.pid);
        }
      });
    });
    return exec.then(test => expect(test).toBe(true));
  });

  afterAll(() => {
    shell.cd('..');
    shell.rm('-rf', 'cli-test');
  });
});
