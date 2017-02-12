const path = require('path');
const shell = require('shelljs');

shell.config.silent = true;

const stageName = 'stage-style';
const getUsingLine = outputArr => outputArr.find(line => line.indexOf('Using Stylelint file') > -1);

describe('kyt lint-style', () => {
  beforeEach(() => {
    shell.mkdir(stageName);
    shell.cd(stageName);
    shell.ln('-s',
      path.join(process.cwd(), '../packages/kyt-core/node_modules'),
      path.join(process.cwd(), 'node_modules'));
  });

  it('should exit the process with code 0 on lint success', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintStyle-default/.', '.');
    const output = shell.exec('npm run lint-style');
    expect(output.code).toBe(0);
  });

  it('should exit the process with code 1 on lint failure', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintStyle-fail/.', '.');
    const output = shell.exec('npm run lint-style');
    expect(output.code).toBe(1);
  });

  it('should bedazzle user on lint success', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintStyle-default/.', '.');
    const output = shell.exec('npm run lint-style');
    const outputArr = output.stdout.split('\n');
    expect(output.code).toBe(0);
    expect(outputArr.includes('✅  Your styles look good! ✨')).toBe(true);
  });

  it('should support a user .stylelintrc with extension', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintStyle-user-rc-with-ext/.', '.');
    const output = shell.exec('npm run lint-style');
    const outputArr = output.stdout.split('\n');
    const usingLine = getUsingLine(outputArr);
    expect(output.code).toBe(0);
    expect(usingLine.endsWith(`${stageName}/.stylelintrc.json`)).toBe(true);
  });

  it('should support a user .stylelintrc', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintStyle-user-rc/.', '.');
    const output = shell.exec('npm run lint-style');
    const outputArr = output.stdout.split('\n');
    const usingLine = getUsingLine(outputArr);
    expect(output.code).toBe(0);
    expect(usingLine.endsWith(`${stageName}/.stylelintrc`)).toBe(true);
  });

  it('should support .scss', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintStyle-scss/.', '.');
    const output = shell.exec('npm run lint-style');
    expect(output.code).toBe(0);
  });

  afterEach(() => {
    shell.cd('..');
    shell.rm('-rf', stageName);
  });
});
