const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = true;

const stageName = 'stage-script';
const getUsingLine = outputArr => outputArr.find(line => line.indexOf('Using ESLint file') > -1);

describe('kyt lint-script', () => {
  it('should exit the process with code 0 on lint success', () => {
    util.setupStageWithFixture(stageName, 'lintScript-default');
    const output = shell.exec('npm run lint-script');
    expect(output.code).toBe(0);
  });

  it('should exit the process with code 1 on lint failure', () => {
    util.setupStageWithFixture(stageName, 'lintScript-fail');
    const output = shell.exec('npm run lint-script');
    expect(output.code).toBe(1);
  });

  it('should bedazzle user on lint success', () => {
    util.setupStageWithFixture(stageName, 'lintScript-default');
    const output = shell.exec('npm run lint-script');
    const outputArr = output.stdout.split('\n');
    expect(output.code).toBe(0);
    expect(outputArr.includes('✅  Your JS looks great ✨')).toBe(true);
  });

  it('should support a user .eslintrc with extension', () => {
    util.setupStageWithFixture(stageName, 'lintScript-user-rc-with-ext');
    const output = shell.exec('npm run lint-script');
    const outputArr = output.stdout.split('\n');
    const usingLine = getUsingLine(outputArr);
    expect(output.code).toBe(0);
    expect(usingLine.endsWith(`${stageName}/.eslintrc.json`)).toBe(true);
  });

  it('should support a user .eslintrc', () => {
    util.setupStageWithFixture(stageName, 'lintScript-user-rc');
    const output = shell.exec('npm run lint-script');
    const outputArr = output.stdout.split('\n');
    const usingLine = getUsingLine(outputArr);
    expect(output.code).toBe(0);
    expect(usingLine.endsWith(`${stageName}/.eslintrc`)).toBe(true);
  });

  it('should test against the .json extension', () => {
    util.setupStageWithFixture(stageName, 'lintScript-json-fail');
    const output = shell.exec('npm run lint-script');
    expect(output.code).toBe(1);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
