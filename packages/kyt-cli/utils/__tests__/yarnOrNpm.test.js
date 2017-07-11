const shell = require('shelljs');
const yarnOrNpm = require('../yarnOrNpm');

describe('yarnOrNpm', () => {
  it('returns yarn when yarn is installed', () => {
    // eslint-disable-next-line no-underscore-dangle
    shell.__setExecReturnValue({
      code: 0,
    });
    expect(yarnOrNpm()).toBe('yarn');
  });

  it('returns npm when yarn is not installed', () => {
    // eslint-disable-next-line no-underscore-dangle
    shell.__setExecReturnValue({
      code: 127,
    });
    expect(yarnOrNpm()).toBe('npm');
  });
});
