const shell = require('shelljs');
const fs = require('fs');
const glob = require('glob');
const util = require('../fixtures/util');

shell.config.silent = true;

const stageName = 'stage-build';

describe('kyt build', () => {
  it('should compile files into a build directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');
    const output = shell.exec('../packages/kyt-core/cli/index.js build');
    expect(shell.test('-f', 'build/publicAssets.json')).toBe(true);
    expect(shell.test('-d', 'build/server')).toBe(true);

    // Should have cleaned existing build directory
    expect(shell.test('-f', 'build/nothing.txt')).toBe(false);

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBe(true);

    // Should produce the manifest and main scripts
    expect(glob.sync('*/build/public/runtime~main-*.js')).toHaveLength(1);
    expect(glob.sync('*/build/public/main-*.js')).toHaveLength(1);

    // // Should fingerprint client and server assets
    expect(glob.sync('*/build/public/img-*.jpg')).toHaveLength(1);
    expect(glob.sync('*/build/public/script-*.js')).toHaveLength(1);
    expect(glob.sync('*/build/public/file-*.ico')).toHaveLength(1);

    // // Should produce asset manifest mappings for client and server assets and bundles
    const manifest = JSON.parse(fs.readFileSync('build/publicAssets.json', 'utf8'));
    expect(manifest['img.jpg']).toMatch(/img-.*\.jpg/);
    expect(manifest['script.js']).toMatch(/script-.*\.js/);
    expect(manifest['file.ico']).toMatch(/file-.*\.ico/);
    expect(manifest['main.js']).toMatch(/main-.*\.js/);

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
