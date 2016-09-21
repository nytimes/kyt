const stubConfig = {
  modifyWebpackConfig: jest.fn(c => c),
  clientPort: 1000,
  serverPort: 2000,
  reactHotLoader: false,
  clientURL: 'clientURL',
  serverURL: 'serverURL',
};
const buildConfigs = require('../buildConfigs');

describe('buildConfigs', () => {
  beforeEach(() => {
    stubConfig.modifyWebpackConfig.mockClear();
  });

  it('should call the userland modifyWebpackConfig', () => {
    const built = buildConfigs(stubConfig);

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
  });
});
