const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = true;

const stageName = 'stage-style';
const getUsingLine = outputArr => outputArr.find(line => line.indexOf('Using Stylelint file') > -1);

describe('kyt lint-style', () => {
  it('should exit the process with code 0 on lint success', () => {
    util.setupStageWithFixture(stageName, 'lintStyle-default');
    const output = shell.exec('npm run lint-style');
    expect(output.code).toBe(0);
  });

  it('should exit the process with code 1 on lint failure', () => {
    util.setupStageWithFixture(stageName, 'lintStyle-fail');
    const output = shell.exec('npm run lint-style');
    expect(output.code).toBe(1);
  });

  it('should bedazzle user on lint success', () => {
    util.setupStageWithFixture(stageName, 'lintStyle-default');
    const output = shell.exec('npm run lint-style');
    const outputArr = output.stdout.split('\n');
    expect(output.code).toBe(0);
    expect(outputArr.includes('✅  Your styles look good! ✨')).toBe(true);
  });

  it('should support a user .stylelintrc with extension', () => {
    util.setupStageWithFixture(stageName, 'lintStyle-user-rc-with-ext');
    const output = shell.exec('npm run lint-style');
    const outputArr = output.stdout.split('\n');
    const usingLine = getUsingLine(outputArr);
    expect(output.code).toBe(0);
    expect(usingLine.endsWith(`${stageName}/.stylelintrc.json`)).toBe(true);
  });

  it('should support a user .stylelintrc', () => {
    util.setupStageWithFixture(stageName, 'lintStyle-user-rc');
    const output = shell.exec('npm run lint-style');
    const outputArr = output.stdout.split('\n');
    const usingLine = getUsingLine(outputArr);
    expect(output.code).toBe(0);
    expect(usingLine.endsWith(`${stageName}/.stylelintrc`)).toBe(true);
  });

  it('should support .scss', () => {
    util.setupStageWithFixture(stageName, 'lintStyle-scss');
    const output = shell.exec('npm run lint-style');
    expect(output.code).toBe(0);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
