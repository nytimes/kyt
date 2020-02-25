const shell = require('shelljs');
const fs = require('fs');
const util = require('../fixtures/util');

shell.config.silent = true;

const stageName = 'stage-build';

describe('kyt build', () => {
  it('should compile files into a build directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');

    const output = shell.exec('../packages/kyt-core/lib/index.js build');
    expect(shell.test('-f', 'build/publicAssets.json')).toBe(true);
    expect(shell.test('-d', 'build/server')).toBe(true);

    // Should have cleaned existing build directory
    expect(shell.test('-f', 'build/nothing.txt')).toBe(false);

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBe(true);

    // `ls` behaves weirdly on Macs vs Linux (tl;dr bash)
    const publicBuild = `${shell.pwd()}/build/public`;

    // Should produce the manifest and main scripts
    expect(shell.ls(`${publicBuild}/runtime~main-*.js`).code).toBe(0);
    expect(shell.ls(`${publicBuild}/main-*.js`).code).toBe(0);

    // Should fingerprint client and server assets
    expect(shell.ls(`${publicBuild}/img-*.jpg`).code).toBe(0);
    expect(shell.ls(`${publicBuild}/script-*.js`).code).toBe(0);
    expect(shell.ls(`${publicBuild}/file-*.ico`).code).toBe(0);

    // Should produce asset manifest mappings for client and server assets and bundles
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

  it('should ignore client build if hasClient=false', () => {
    util.setupStageWithFixture(stageName, 'build-no-client');
    const output = shell.exec('npm run build');
    expect(output.code).toBe(0);
    expect(shell.test('-d', 'build/server')).toBe(true);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
