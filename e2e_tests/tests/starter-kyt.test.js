const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const util = require('../fixtures/util');
const kill = require('../utils/psKill');

shell.config.silent = false;

describe('starter kyts', () => {
  describe.each([
    [
      'kyt-starter-universal',
      'should start a dev server on :3000',
      '✅  Development started',
      'curl -I localhost:3000',
      '200',
      '✅  server started on port: 3000',
    ],
    [
      'kyt-starter-static',
      'should start a server on :3001',
      '✅  Client started',
      'curl -sb -o "" localhost:3001',
      '<html>',
      '✅  Done building',
    ],
  ])('%s', (npmName, startMessage, devMessage, curlCommand, curlOutput, buildMessage) => {
    shell.cd(path.join(util.rootDir, `packages/${npmName}/starter-src`));

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    const dataCallback = (child, message) => data => {
      if (data.includes(message)) {
        shell.exec('sleep 5');
        const output = shell.exec(curlCommand);
        const test = output.stdout.includes(curlOutput);
        expect(test).toBe(true);
      }
    };

    const kytCli = path.join(util.rootDir, 'packages/kyt-core/lib/index.js');

    it(startMessage, () => {
      const child = shell.exec(`${kytCli} dev`);
      child.stdout.on('data', dataCallback(child, devMessage));
      kill(child.pid);
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 400000; // eslint-disable-line no-undef

    it('should build', () => {
      const output = shell.exec(`${kytCli} build`);

      if (npmName === 'kyt-starter-universal') {
        const child = shell.exec('node build/server/main.js');
        child.stdout.on('data', dataCallback(child, buildMessage));
      } else {
        expect(output.stdout.includes(buildMessage)).toBe(true);
        const htmlOutput = fs.readFileSync('build/public/index.html', 'utf8');
        expect(htmlOutput.includes('<html>')).toBe(true);
        kill(output.pid);
      }
    });

    afterAll(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });
});
