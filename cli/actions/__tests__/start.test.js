jest.mock('shelljs');
jest.mock('../../logger');

const shell = require('shelljs');
const logger = require('../../logger');
const start = require('../start');

describe('start', () => {
  const serverURL = { href: 'href' };
  start({ serverURL });

  it('logs start and end', () => {
    expect(logger.start).toBeCalledWith('Starting production...');
    expect(logger.end).toBeCalledWith(`Server running at ${serverURL.href}`);
  });

  it('executes the node process asynchronously', () => {
    expect(shell.exec).toBeCalledWith('node build/server/main.js', { async: true });
  });
});
