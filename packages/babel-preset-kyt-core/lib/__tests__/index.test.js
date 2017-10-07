/* eslint-disable global-require */

jest.setMock('babel-preset-env', 'env');
jest.setMock('babel-plugin-transform-runtime', 'runtime');
jest.setMock('babel-plugin-transform-es2015-modules-commonjs', 'commonjs');
jest.setMock('babel-plugin-syntax-dynamic-import', 'import');

describe('babel-preset-kyt-core', () => {
  it('should load default presets and plugins', () => {
    const presetKytCore = require('../index.js');
    expect(presetKytCore()).toMatchSnapshot();
  });

  it('should use default server preset-env configuration when KYT_ENV_TYPE=server', () => {
    process.env.KYT_ENV_TYPE = 'server';
    const presetKytCore = require('../index.js');
    const config = presetKytCore();
    expect(config.presets[0][1].targets.node).toEqual('current');
  });

  it('should override default preset-env configuration with `envOptions` when KYT_ENV_TYPE=client', () => {
    process.env.KYT_ENV_TYPE = 'client';
    const presetKytCore = require('../index.js');
    const config = presetKytCore(
      {},
      {
        envOptions: { client: { targets: { browsers: ['last 10 versions'] } } },
      }
    );
    expect(config.presets[0][1].targets.browsers[0]).toEqual('last 10 versions');
  });

  it('should override default preset-env configuration with `envOptions` when KYT_ENV_TYPE=server', () => {
    process.env.KYT_ENV_TYPE = 'server';
    const presetKytCore = require('../index.js');
    const config = presetKytCore({}, { envOptions: { server: { targets: { node: false } } } });
    expect(config.presets[0][1].targets.node).toEqual(false);
  });

  it('should support an `includeRuntime` option', () => {
    const presetKytCore = require('../index.js');
    const config = presetKytCore({}, { includeRuntime: true });
    expect(config.plugins[0]).toEqual('runtime');
  });
});
