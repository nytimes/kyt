const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const stageName = 'stage-test';

describe('kyt test', () => {
  it('should pass on success', () => {
    util.setupStageWithFixture(stageName, 'test-default');
    const output = shell.exec('npm run test');
    expect(output.code).toBe(0);
  });

  it('should respect modifyJestConfig', () => {
    util.setupStageWithFixture(stageName, 'test-modify-config');
    const output = shell.exec('npm run test');
    expect(output.code).toBe(0);
  });

  it('should respect cli options', () => {
    util.setupStageWithFixture(stageName, 'test-options');
    const output = shell.exec('npm run test');
    expect(output.code).toBe(0);
  });

  it('should setup a global window/document', () => {
    util.setupStageWithFixture(stageName, 'test-global-setup');
    const output = shell.exec('npm run test');
    expect(output.code).toBe(0);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
