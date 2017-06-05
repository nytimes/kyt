const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = true;

const stageName = 'stage-build';

describe('kyt build', () => {
  it('should compile files into a build directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');
    const output = shell.exec('npm run build');
    expect(shell.test('-f', 'build/publicAssets.json')).toBe(true);
    expect(shell.test('-d', 'build/server')).toBe(true);

    // Should have cleaned existing build directory
    expect(shell.test('-f', 'build/nothing.txt')).toBe(false);

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBe(true);

    // Should produce the manifest, main and vendor scripts
    expect(shell.ls('build/public/manifest-*.js').code).toBe(0);
    expect(shell.ls('build/public/main-*.js').code).toBe(0);
    expect(shell.ls('build/public/vendor-*.js').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should ignore server build if hasServer=false', () => {
    util.setupStageWithFixture(stageName, 'build-no-server');
    const output = shell.exec('npm run build');
    expect(output.code).toBe(0);
    expect(shell.test('-d', 'build/server')).toBe(false);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
