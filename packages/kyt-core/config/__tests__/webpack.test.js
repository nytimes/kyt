const devClientConfig = require('../webpack.dev.client');
const devServerConfig = require('../webpack.dev.server');
const prodClientConfig = require('../webpack.prod.client');
const prodServerConfig = require('../webpack.prod.server');

describe('webpack.dev.client', () => {
  it('has babel-polyfill as first entry in entry.main array', () => {
    const config = devClientConfig({ clientURL: {} });
    expect(config.entry.main[0]).toBe('babel-polyfill');
  });
});

describe('webpack.dev.server', () => {
  it('has babel-polyfill as first entry in entry.main array', () => {
    const config = devServerConfig({ publicPath: '/' });
    expect(config.entry.main[0]).toBe('babel-polyfill');
  });
});

describe('webpack.prod.client', () => {
  it('has babel-polyfill as first entry in entry.main array', () => {
    const config = prodClientConfig({ clientURL: {} });
    expect(config.entry.main[0]).toBe('babel-polyfill');
  });
});

describe('webpack.prod.server', () => {
  it('has babel-polyfill as first entry in entry.main array', () => {
    const config = prodServerConfig({ publicPath: '/' });
    expect(config.entry.main[0]).toBe('babel-polyfill');
  });
});
