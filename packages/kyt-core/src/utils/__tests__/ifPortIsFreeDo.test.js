describe('ifPortIsFreeDo', () => {
  jest.mock('kyt-utils/logger');

  const processExitMock = jest.fn();
  global.process.exit = processExitMock;

  beforeEach(() => {
    jest.resetModules();
    processExitMock.mockClear();
  });

  it('should call the callback when port is free', () => {
    const mockCallback = jest.fn();
    jest.setMock('detect-port', (port, cb) => cb(null, port));
    const ipifd = require('../ifPortIsFreeDo');

    ipifd(1, mockCallback);

    expect(mockCallback).toBeCalled();
  });

  it('should log and exit process when port is not free', () => {
    const mockCallback = jest.fn();
    jest.setMock('detect-port', (port, cb) => cb(null, port + 1));
    const logger = require('kyt-utils/logger');
    const ipifd = require('../ifPortIsFreeDo');

    ipifd(1, mockCallback);

    expect(mockCallback.mock.calls.length).toBe(0);
    expect(logger.error).toBeCalledWith('port: 1 is in use.');
    expect(logger.info).toBeCalled();
    expect(processExitMock).toBeCalled();
  });
});
