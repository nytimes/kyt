const shell = require('shelljs');
const util = require('../fixtures/util');
const kill = require('../utils/psKill');
const path = require('path');
const fs = require('fs');

// shell.config.silent = true;

describe('starter kyts', () => {
  describe('kyt-starter-universal', () => {
    beforeAll(() => {
      shell.cd(path.join(util.rootDir, 'packages/kyt-starter-universal/starter-src'));
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    it('should start a dev server on :3000', () => {
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec('node_modules/kyt/cli/index.js dev', () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (data.includes('✅  Development started')) {
            shell.exec('sleep 5');
            const output = shell.exec('curl -I localhost:3000');
            outputTest = output.stdout.includes('200');
            kill(child.pid);
          }
        });
      });
      return run.then(test => expect(test).toBe(true));
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 400000; // eslint-disable-line no-undef

    it('should build and run', () => {
      let outputTest;
      shell.exec('node_modules/kyt/cli/index.js build');
      const run = new Promise(resolve => {
        const child = shell.exec('node build/server/main.js', () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (data.includes('✅  server started on port: 3000')) {
            shell.exec('sleep 5');
            const output = shell.exec('curl -I localhost:3000');
            outputTest = output.stdout.includes('200');
            kill(child.pid);
          }
        });
      });
      return run.then(test => expect(test).toBe(true));
    });

    afterAll(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });

  describe('kyt-starter-static', () => {
    beforeAll(() => {
      shell.cd(path.join(util.rootDir, 'packages/kyt-starter-static/starter-src'));
    });

    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000; // eslint-disable-line no-undef

    it('should start a server on :3001', () => {
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec('node_modules/kyt/cli/index.js dev', () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (data.includes('✅  Client started')) {
            shell.exec('sleep 5');
            const output = shell.exec('curl -sb -o "" localhost:3001');
            outputTest = output.stdout.includes('<html>');
            kill(child.pid);
          }
        });
      });
      return run.then(test => expect(test).toBe(true));
    });

    it('should build', () => {
      const output = shell.exec('node_modules/kyt/cli/index.js build');
      expect(output.stdout.includes('✅  Done building')).toBe(true);
      const htmlOutput = fs.readFileSync('build/public/index.html', 'utf8');
      expect(htmlOutput.includes('<html>')).toBe(true);
    });

    afterAll(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });
});
