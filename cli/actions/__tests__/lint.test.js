jest.setMock('glob', {
  sync: () => ({ length: 1 }),
});
jest.mock('../../logger');
jest.mock('../../../utils/paths');

describe('lint', () => {
  global.process.exit = jest.fn();
  const logger = require('../../logger');
  const lint = require('../lint');
  const eslint = require('eslint');

  beforeEach(() => {
    jest.resetModules();
  });

  it('logs and exits 0 when no errors', () => {
    lint();
    expect(logger.end).toBeCalledWith('Your JS looks great ✨');
    expect(process.exit).toBeCalledWith(0);
  });

  it('logs and exits 0 when there are warnings', () => {
    eslint.__setExecuteOnFiles({ warningCount: 1 }); // eslint-disable-line no-underscore-dangle
    lint();

    expect(logger.end)
      .toBeCalledWith('Your JS looks OK, though there were warnings 🤔👆');

    expect(process.exit).toBeCalledWith(0);
  });

  it('exits 1 when there are errors', () => {
    eslint.__setExecuteOnFiles({ errorCount: 1 }); // eslint-disable-line no-underscore-dangle
    lint();

    expect(process.exit).toBeCalledWith(1);
  });
});
