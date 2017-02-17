const path = require('path');
const shell = require('shelljs');

shell.config.silent = true;

const stageName = 'stage-script';
const getUsingLine = outputArr => outputArr.find(line => line.indexOf('Using ESLint file') > -1);

describe('kyt lint-script', () => {
  beforeEach(() => {
    shell.mkdir(stageName);
    shell.cd(stageName);
    shell.ln('-s',
      path.join(process.cwd(), '../packages/kyt-core/node_modules'),
      path.join(process.cwd(), 'node_modules'));
  });

  it('should exit the process with code 0 on lint success', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintScript-default/.', '.');
    const output = shell.exec('npm run lint-script');
    expect(output.code).toBe(0);
  });

  it('should exit the process with code 1 on lint failure', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintScript-fail/.', '.');
    const output = shell.exec('npm run lint-script');
    expect(output.code).toBe(1);
  });

  it('should bedazzle user on lint success', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintScript-default/.', '.');
    const output = shell.exec('npm run lint-script');
    const outputArr = output.stdout.split('\n');
    expect(output.code).toBe(0);
    expect(outputArr.includes('✅  Your JS looks great ✨')).toBe(true);
  });

  it('should support a user .eslintrc with extension', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintScript-user-rc-with-ext/.', '.');
    const output = shell.exec('npm run lint-script');
    const outputArr = output.stdout.split('\n');
    const usingLine = getUsingLine(outputArr);
    expect(output.code).toBe(0);
    expect(usingLine.endsWith(`${stageName}/.eslintrc.json`)).toBe(true);
  });

  it('should support a user .eslintrc', () => {
    shell.cp('-R', '../e2e_tests/fixtures/lintScript-user-rc/.', '.');
    const output = shell.exec('npm run lint-script');
    const outputArr = output.stdout.split('\n');
    const usingLine = getUsingLine(outputArr);
    expect(output.code).toBe(0);
    expect(usingLine.endsWith(`${stageName}/.eslintrc`)).toBe(true);
  });

  afterEach(() => {
    shell.cd('..');
    shell.rm('-rf', stageName);
  });
});
