jest.setMock('@babel/preset-env', 'env');
jest.setMock('@babel/plugin-proposal-class-properties', 'class-properties');
jest.setMock('@babel/plugin-proposal-decorators', 'proposal-decorators');
jest.setMock('@babel/plugin-proposal-optional-chaining', 'optional-chaining');
jest.setMock('@babel/plugin-transform-runtime', 'runtime');
jest.setMock('@babel/plugin-syntax-dynamic-import', 'import');
jest.setMock('babel-plugin-dynamic-import-node', 'import-node');

const presetKytCore = require('..');

describe('babel-preset-kyt-core', () => {
  it('should load default presets and plugins', () => {
    expect(presetKytCore()).toMatchSnapshot();
  });

  it('should use default server preset-env configuration when KYT_ENV_TYPE=server', () => {
    process.env.KYT_ENV_TYPE = 'server';
    const config = presetKytCore();
    expect(config.presets[0][1].targets.node).toEqual('current');
  });

  it('should override default preset-env configuration with `envOptions` when KYT_ENV_TYPE=client', () => {
    process.env.KYT_ENV_TYPE = 'client';
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
    const config = presetKytCore({}, { envOptions: { server: { targets: { node: false } } } });
    expect(config.presets[0][1].targets.node).toEqual(false);
  });

  it('should support an `includeRuntime` option', () => {
    const config = presetKytCore({}, { includeRuntime: true });
    expect(config.plugins[3]).toEqual('runtime');
  });

  it('should include a dynamic import plugin', () => {
    const config = presetKytCore();
    expect(config.plugins[3]).toEqual('import');
  });

  it('should include a import node plugin when KYT_ENV_TYPE=test', () => {
    process.env.KYT_ENV_TYPE = 'test';
    const config = presetKytCore();
    expect(config.plugins[4]).toEqual('import-node');
  });
});
