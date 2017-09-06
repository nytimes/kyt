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
    const pluginBeforeRun = plugin.mock.calls[0][1];
    const pluginDone = plugin.mock.calls[1][1];

    it('calls webpack and defines a done and before-run function', () => {
      expect(logger.task).toBeCalledWith('Server webpack configuration compiled');
      expect(typeof pluginDone).toBe('function');
      expect(typeof pluginBeforeRun).toBe('function');
    });

    it('sets the process KYT_ENV_TYPE before running', () => {
      pluginBeforeRun({}, () => {});
      expect(process.env.KYT_ENV_TYPE).toEqual('server');
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

    it('removes the process KYT_ENV_TYPE when done', () => {
      pluginDone({ hasErrors: () => true, hasWarnings: () => true });
      expect(process.env.KYT_ENV_TYPE).toEqual(undefined);
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

  describe('when called with a target=web, webpack config', () => {
    plugin.mockReset();
    webpackCompiler({ test: 'config', target: 'web' }, cb);
    const pluginBeforeRun = plugin.mock.calls[0][1];

    it('sets the process KYT_ENV_TYPE to client before running', () => {
      pluginBeforeRun({}, () => {});
      expect(process.env.KYT_ENV_TYPE).toEqual('client');
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
