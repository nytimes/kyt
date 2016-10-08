const thisResolved = require.resolve(__filename);
const stubBabelrc = {
  stub: true,
  env: {
    development: {
      plugins: [thisResolved],
      presets: [[thisResolved]],
    },
  },
};
jest.mock('../../cli/logger');
jest.setMock('fs', {
  readFileSync: () => JSON.stringify(stubBabelrc),
});
jest.setMock('path', {
  resolve: a => a,
});

const modifyBabelConfig = jest.fn(c => c);
const mockKytConfig = () => ({ modifyBabelConfig });
jest.setMock('../../utils/kytConfig', mockKytConfig);

const logger = require('../../cli/logger');

const babel = require('../babel');

describe('babel', () => {
  beforeEach(() => {
    modifyBabelConfig.mockClear();
    global.process.exit = jest.fn();
    Object.keys(logger).forEach(k => logger[k].mockClear());
  });

  it('does not call process.exit or logger.error on a successful run', () => {
    babel();
    expect(logger.error).not.toBeCalled();
    expect(global.process.exit).not.toBeCalled();
  });

  it('sets flags', () => {
    const babelrc = babel();
    expect(babelrc.babelrc).toBe(false);
    expect(babelrc.cacheDirectory).toBe(false);
  });

  it('adds RHL when given the option', () => {
    const babelrc = babel({ reactHotLoader: true });
    const plugins = babelrc.env.development.plugins;
    expect(plugins[plugins.length - 1]).toMatch(/react-hot-loader\/babel\.js$/);
  });

  it('resolves plugins and presets', () => {
    const babelrc = babel();
    expect(babelrc.env.development.plugins).toEqual([thisResolved]);
    expect(babelrc.env.development.presets).toEqual([[thisResolved]]);
  });

  it('calls kytConfig\'s modifyBabelConfig', () => {
    const opts = {};
    babel(opts);
    const kytConfig = require('../../utils/kytConfig');
    const config = kytConfig();
    expect(config.modifyBabelConfig).toBeCalled();
    expect(config.modifyBabelConfig.mock.calls[0][0]).toEqual(Object.assign({}, stubBabelrc, {
      babelrc: false,
      cacheDirectory: false,
      plugins: [],
      presets: [],
    }));
    expect(config.modifyBabelConfig.mock.calls[0][1]).toBe(opts);
  });

  it('logs an error and exits the process if modifyBabelConfig throws', () => {
    const err = new Error('oh no');
    modifyBabelConfig.mockImplementationOnce(() => { throw err; });
    babel();
    expect(logger.error).toBeCalledWith('Error in your kyt.config.js modifyBabelConfig():', err);
    expect(global.process.exit).toBeCalledWith(1);
  });
});
