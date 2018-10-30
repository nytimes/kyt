const prodClientConfig = jest.fn(() => ({
  target: 'web',
}));
const prodServerConfig = jest.fn(() => ({
  target: 'node',
  entry: { main: 'something' },
}));
const devClientConfig = jest.fn(() => ({
  target: 'web',
}));
const devServerConfig = jest.fn(() => ({
  target: 'node',
  entry: { main: 'something' },
}));
const baseConfig = jest.fn(() => ({}));
const logger = {
  info: jest.fn(),
};

// for now just mock these
jest.setMock('../../config/webpack.dev.client', devClientConfig);
jest.setMock('../../config/webpack.dev.server', devServerConfig);
jest.setMock('../../config/webpack.prod.client', prodClientConfig);
jest.setMock('../../config/webpack.prod.server', prodServerConfig);
jest.setMock('../../config/webpack.base', baseConfig);

jest.setMock('kyt-utils/logger', logger);

const stubConfig = {
  modifyWebpackConfig: jest.fn(c => c),
  clientPort: 1000,
  serverPort: 2000,
  reactHotLoader: false,
  clientURL: 'clientURL',
  serverURL: 'serverURL',
};
const buildConfigs = require('../buildConfigs');

global.process.exit = jest.fn();

describe('buildConfigs', () => {
  beforeEach(() => {
    stubConfig.modifyWebpackConfig.mockClear();
    global.process.exit.mockClear();
  });

  it('should call the userland modifyWebpackConfig', () => {
    const built = buildConfigs(stubConfig);

    expect(logger.info).toHaveBeenCalledWith(
      'No user .babelrc found. Using kyt default babel preset...'
    );

    // for client
    const clientCall = stubConfig.modifyWebpackConfig.mock.calls[0];
    expect(clientCall[1].type).toBe('client');
    expect(clientCall[1].environment).toBe('development');

    // for server
    const serverCall = stubConfig.modifyWebpackConfig.mock.calls[1];
    expect(serverCall[1].type).toBe('server');
    expect(serverCall[1].environment).toBe('development');

    // expected exports
    expect(built.clientConfig).toBeDefined();
    expect(built.clientConfig.target).toBe('web');
    expect(built.serverConfig).toBeDefined();
    expect(built.serverConfig.target).toBe('node');

    expect(global.process.exit).not.toHaveBeenCalled();
  });

  it('for production', () => {
    const built = buildConfigs(stubConfig, 'production');

    // for client
    const clientCall = stubConfig.modifyWebpackConfig.mock.calls[0];
    expect(clientCall[1].type).toBe('client');
    expect(clientCall[1].environment).toBe('production');

    // for server
    const serverCall = stubConfig.modifyWebpackConfig.mock.calls[1];
    expect(serverCall[1].type).toBe('server');
    expect(serverCall[1].environment).toBe('production');

    // expected exports
    expect(built.clientConfig).toBeDefined();
    expect(built.clientConfig.target).toBe('web');
    expect(built.serverConfig).toBeDefined();
    expect(built.serverConfig.target).toBe('node');

    expect(global.process.exit).not.toHaveBeenCalled();
  });
});
