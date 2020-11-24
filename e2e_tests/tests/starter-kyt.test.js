const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const util = require('../fixtures/util');
const kill = require('../utils/psKill');

shell.config.silent = false;

describe('starter kyts', () => {
  const kytCli = path.join(util.rootDir, 'packages/kyt-core/lib/index.js');

  describe('kyt-starter-universal', () => {
    beforeAll(() => {
      shell.cd(path.join(util.rootDir, 'packages/kyt-starter-universal/starter-src'));
    });

    jest.setTimeout(1000000);

    it('should start a dev server on :3000', () => {
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(`${kytCli} dev`, () => {
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

    jest.setTimeout(400000);

    it('should build and run', () => {
      let outputTest;
      shell.exec(`${kytCli} build`);
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

    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

    it('should start a server on :3001', () => {
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(`${kytCli} dev`, () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (data.includes('Project is running at http://localhost:3001/')) {
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
      const output = shell.exec(`${kytCli} build`);

      expect(output.stdout).toContain('✅  Done building');

      const htmlOutput = fs.readFileSync('build/public/index.html', 'utf8');

      expect(htmlOutput).toContain('<html>');
    });

    afterAll(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });
});
