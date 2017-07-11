/* eslint-disable global-require */

const plugin = jest.fn();
const webpackMock = jest.fn(obj => {
  if (obj.error) throw new Error('test error');
  return { plugin };
});
jest.setMock('webpack', webpackMock);
const cb = jest.fn();
jest.mock('kyt-utils/logger');

describe('webpackCompiler', () => {
  const logger = require('kyt-utils/logger');
  const webpackCompiler = require('../webpackCompiler');

  beforeEach(() => {
    jest.resetModules();
  });

  describe('when called with valid webpack config', () => {
    const compiler = webpackCompiler({ test: 'config' }, cb);
    const pluginDone = plugin.mock.calls[0][1];

    it('calls webpack and defines a done function', () => {
      expect(logger.task).toBeCalledWith('Server webpack configuration compiled');
      expect(typeof pluginDone).toBe('function');
    });

    it('then displays any errors', () => {
      pluginDone({ hasErrors: () => true, hasWarnings: () => true });

      expect(logger.error).toBeCalled();
      expect(logger.info).toBeCalledWith('See webpack error above');
    });

    it('then displays any warnings', () => {
      pluginDone({
        hasErrors: () => false,
        hasWarnings: () => true,
        toJson: () => ({ warnings: [] }),
      });
      expect(logger.warn).toBeCalled();
    });

    it('calls the provided callback', () => {
      pluginDone({ hasErrors: () => false, hasWarnings: () => false });
      expect(logger.task).toBeCalledWith('Server build successful');
      expect(cb).toBeCalled();
    });

    it('returns the webpackCompiler', () => {
      expect(compiler).toBeDefined();
    });
  });

  it('bails on invalid wepback config', () => {
    global.process.exit = jest.fn();
    try {
      webpackCompiler({ error: true });
    } catch (x) {} // eslint-disable-line no-empty
    expect(logger.error).toBeCalled();
    expect(global.process.exit).toBeCalled();
  });
});
