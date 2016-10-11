jest.setMock('glob', {
  sync: jest.fn().mockReturnValueOnce(['filename']).mockReturnValue([]),
});
jest.setMock('path', {
  join: jest.fn().mockReturnValue('base filename'),
});
jest.mock('../../logger');
jest.mock('../../../utils/paths');

jest.mock('shelljs', () => (
  {
    exec: () => ({
      stdout: '',
      code: 0,
    }),
  }
));

describe('lint', () => {
  global.process.exit = jest.fn();
  const logger = require('../../logger');
  const lint = require('../lint');

  beforeEach(() => {
    jest.resetModules();
  });

  it('logs the user linter filename when found', () => {
    lint({}, []);
    expect(logger.info).toBeCalledWith('Using ESLint file: filename');
  });

  it('logs the base filename when there is no user file', () => {
    lint({}, []);
    expect(logger.info).toBeCalledWith('Using ESLint file: base filename');
  });

  it('logs and exits 0 when no errors', () => {
    lint({}, []);
    expect(logger.end).toBeCalledWith('Your JS looks great ✨');
    expect(process.exit).toBeCalledWith(0);
  });

  // it('logs and exits 0 when there are warnings', () => {
  //   lint({}, []);
  //   expect(logger.end)
  //     .toBeCalledWith('Your JS looks OK, though there were warnings 🤔👆');
  //   expect(process.exit).toBeCalledWith(0);
  // });

  // it('exits 1 when there are errors', () => {
  //   eslint.__setExecuteOnFiles({ errorCount: 1 }); // eslint-disable-line no-underscore-dangle
  //   lint({}, []);
  //
  //   expect(process.exit).toBeCalledWith(1);
  // });
});
