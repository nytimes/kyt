jest.mock('shelljs');
jest.mock('../../logger');

const shell = require('shelljs');
const logger = require('../../logger');
const start = require('../start');

describe('start', () => {
  const serverURL = { href: 'href' };
  start({ serverURL });

  it('logs start, task and end', () => {
    expect(logger.start).toBeCalledWith('Starting production...');
    expect(logger.task).toBeCalledWith(`Server running on ${serverURL.href}`);
    expect(logger.end).toBeCalledWith('Production started');
  });

  it('executes the node process asynchronously', () => {
    expect(shell.exec).toBeCalledWith('node build/server/main.js', { async: true });
  });
});
