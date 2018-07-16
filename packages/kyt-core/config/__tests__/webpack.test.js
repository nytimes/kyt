const shell = {
  test: jest.fn(),
};

const logger = {
  warn: jest.fn(),
};

const path = {
  join: jest.fn(),
  resolve: jest.fn(),
};

const extractPlugin = jest.fn();
extractPlugin.extract = jest.fn();

const webpack = {
  LoaderOptionsPlugin: jest.fn(),
  optimize: {
    UglifyJsPlugin: jest.fn(),
    LimitChunkCountPlugin: jest.fn(),
    CommonsChunkPlugin: jest.fn(),
    AggressiveMergingPlugin: jest.fn(),
    ModuleConcatenationPlugin: jest.fn(),
  },
  BannerPlugin: jest.fn(),
  NoEmitOnErrorsPlugin: jest.fn(),
  HotModuleReplacementPlugin: jest.fn(),
  DefinePlugin: jest.fn(),
  HashedModuleIdsPlugin: jest.fn(),
};

jest.setMock('shelljs', shell);
jest.setMock('path', path);
jest.setMock('kyt-utils/logger', logger);
jest.setMock('webpack', webpack);
jest.setMock('../../utils/getPostcssLoader', {});
jest.setMock('extract-text-webpack-plugin', extractPlugin);

const baseConfig = require('../webpack.base');

describe('webpack.base', () => {
  beforeEach(() => {
    logger.warn.mockClear();
    webpack.DefinePlugin.mockClear();
  });
  it("doesn't set up a babel preset if a .babelrc exists", () => {
    shell.test.mockImplementationOnce(() => true);
    const config = baseConfig({ clientURL: {}, publicPath: '/' });
    const babelLoader = config.module.rules.find(loader => loader.use);
    expect(babelLoader.use[1].options.presets).toBeUndefined();
    expect(logger.warn).not.toHaveBeenCalled();
  });
  it('sets up kyt-core babel preset if a .babelrc exists', () => {
    shell.test.mockImplementationOnce(() => false);
    const config = baseConfig({ clientURL: {}, publicPath: '/' });
    const babelLoader = config.module.rules.find(loader => loader.use);
    expect(babelLoader.use[1].options.presets.length).toBe(1);
    expect(babelLoader.use[1].options.presets[0]).toMatch(/babel-preset-kyt-core/);
  });
  it('sets up a DefinePlugin entry for options.type', () => {
    baseConfig({ clientURL: {}, publicPath: '/', type: 'foo' });
    expect(webpack.DefinePlugin.mock.calls[0][0].KYT.EXECUTION_ENVIRONMENT).toBe('"foo"');
  });
});
