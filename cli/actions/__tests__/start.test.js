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
      start({ serverURL, hasServer: true }, []);
    });

    it('does not call process.exit or logger.error', () => {
      expect(logger.error.mock.calls.length).toBe(0);
      expect(global.process.exit.mock.calls.length).toBe(0);
    });

    it('logs start, task and end', () => {
      expect(logger.start).toBeCalledWith('Starting production server...');
      expect(logger.task).toBeCalledWith(`Server running on ${serverURL.href}`);
      expect(logger.end).toBeCalledWith('Production started');
    });

    it('executes the node process asynchronously', () => {
      expect(shell.exec).toBeCalledWith('node build/server/main.js ', { async: true });
    });
  });

  describe('hasServer set to false', () => {
    beforeEach(() => {
      start({ hasServer: false }, []);
    });

    it('logs an error and exits', () => {
      expect(logger.error).toBeCalledWith('You have hasServer set to false, bailing');
      expect(global.process.exit.mock.calls).toEqual([[1]]);
    });
  });
});
