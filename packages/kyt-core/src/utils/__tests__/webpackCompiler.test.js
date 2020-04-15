const hooks = {
  beforeRun: {
    tap: jest.fn(),
  },
  done: {
    tap: jest.fn(),
  },
};
const webpackMock = jest.fn(obj => {
  if (obj.error) throw new Error('test error');
  return { hooks };
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
    const beforeRunHook = hooks.beforeRun.tap.mock.calls[0][1];
    const doneHook = hooks.done.tap.mock.calls[0][1];

    it('calls webpack and defines a done and before-run function', () => {
      expect(logger.task).toHaveBeenCalledWith('Server webpack configuration compiled');
      expect(typeof doneHook).toBe('function');
      expect(typeof beforeRunHook).toBe('function');
    });

    it('sets the process KYT_ENV_TYPE before running', () => {
      beforeRunHook({}, () => {});

      expect(process.env.KYT_ENV_TYPE).toEqual('server');
    });

    it('then displays any errors', () => {
      doneHook({ hasErrors: () => true, hasWarnings: () => true });

      expect(logger.error).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('See webpack error above');
    });

    it('then displays any warnings', () => {
      doneHook({
        hasErrors: () => false,
        hasWarnings: () => true,
        toJson: () => ({ warnings: [] }),
      });

      expect(logger.warn).toHaveBeenCalled();
    });

    it('removes the process KYT_ENV_TYPE when done', () => {
      doneHook({ hasErrors: () => true, hasWarnings: () => true });

      expect(process.env.KYT_ENV_TYPE).toBeUndefined();
    });

    it('calls the provided callback', () => {
      doneHook({ hasErrors: () => false, hasWarnings: () => false });

      expect(logger.task).toHaveBeenCalledWith('Server build successful');
      expect(cb).toHaveBeenCalled();
    });

    it('returns the webpackCompiler', () => {
      expect(compiler).toBeDefined();
    });
  });

  describe('when called with a target=web, webpack config', () => {
    hooks.beforeRun.tap.mockReset();
    webpackCompiler({ test: 'config', target: 'web' }, cb);
    const beforeRunHook = hooks.beforeRun.tap.mock.calls[0][1];

    it('sets the process KYT_ENV_TYPE to client before running', () => {
      beforeRunHook({}, () => {});

      expect(process.env.KYT_ENV_TYPE).toEqual('client');
    });
  });

  it('bails on invalid wepback config', () => {
    global.process.exit = jest.fn();
    try {
      webpackCompiler({ error: true });
    } catch (x) {} // eslint-disable-line no-empty

    expect(logger.error).toHaveBeenCalled();
    expect(global.process.exit).toHaveBeenCalled();
  });
});
