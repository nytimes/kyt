jest.mock('shelljs');
jest.mock('../../logger');

const shell = require('shelljs');
const logger = require('../../logger');
const start = require('../start');

describe('start', () => {
  const serverURL = { href: 'href' };

  beforeEach(() => {
    global.process.exit = jest.fn();
    Object.keys(logger).forEach((key) => { logger[key].mockClear(); });
  });

  describe('default case', () => {
    beforeEach(() => {
      start({ serverURL });
    });

    it('does not call process.exit or logger.error', () => {
      expect(logger.error.mock.calls.length).toBe(0);
      expect(global.process.exit.mock.calls.length).toBe(0);
    });

    it('logs start and end', () => {
      expect(logger.start).toBeCalledWith('Starting production server...');
      expect(logger.end).toBeCalledWith(`Server running at ${serverURL.href}`);
    });

    it('executes the node process asynchronously', () => {
      expect(shell.exec).toBeCalledWith('node build/server/main.js', { async: true });
    });
  });

  describe('noServer set to true', () => {
    beforeEach(() => {
      start({ noServer: true });
    });

    it('logs an error and exits', () => {
      expect(logger.error).toBeCalledWith('You have noServer set to true, bailing');
      expect(global.process.exit.mock.calls).toEqual([[1]]);
    });
  });
});
