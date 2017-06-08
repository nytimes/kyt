/* eslint-disable global-require */

jest.setMock('glob', {
  sync: jest.fn().mockReturnValueOnce(['filename']).mockReturnValue([]),
});
jest.setMock('path', {
  join: jest.fn().mockReturnValue('base filename'),
});
jest.mock('kyt-utils/logger');
jest.mock('kyt-utils/paths');

jest.mock('shelljs', () => ({
  exec: () => ({
    stdout: '',
    code: 0,
  }),
  config: {
    silent: false,
  },
}));

describe('lint', () => {
  global.process.exit = jest.fn();
  const logger = require('kyt-utils/logger');
  const lint = require('../lintScript');

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
});
