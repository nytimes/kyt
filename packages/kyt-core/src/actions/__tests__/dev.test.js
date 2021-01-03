jest.mock('kyt-utils/logger');
jest.mock('webpack-dev-server');
jest.mock('../../utils/buildConfigs');
jest.mock('../../utils/webpackCompiler');
jest.setMock('path', {
  resolve: p => p,
  join: (p, q) => p + q,
});
jest.setMock('shelljs', {
  test: () => true,
  rm: () => ({ code: 0 }),
});

const logger = require('kyt-utils/logger');
const webpackCompiler = require('../../utils/webpackCompiler');
const buildConfigs = require('../../utils/buildConfigs');

const dev = require('../dev');

describe('dev', () => {
  // this can be replaced with jest.clearAllMocks in jest 16.0.0
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const href = { href: 'href' };
  const port = 1024;
  const hostname = 'hostname';
  const mockURL = { href, port, hostname };

  it('runs correctly with a server enabled', async () => {
    await dev(
      {
        clientURL: mockURL,
        serverURL: mockURL,
        hasServer: true,
        hasClient: true,
      },
      []
    );

    // should log that it cleaned the build directory
    expect(logger.task.mock.calls[0][0]).toEqual('Cleaned ./build');

    // watches files for server restarting
    // client dev server

    // should call webpackCompiler
    expect(webpackCompiler.mock.calls.length > 0).toBe(true);
    // should call buildConfigs
    expect(buildConfigs.mock.calls.length > 0).toBe(true);

    // clientCompiler
    // first call to webpackCompiler should be client compilation
    expect(webpackCompiler.mock.calls[0][0]).toEqual('clientConfig');

    // serverCompiler
    // second call to webpackCompiler should be server compilation
    expect(webpackCompiler.mock.calls[1][0]).toEqual('serverConfig');
  });

  it('runs correctly in client-only mode', async () => {
    await dev({
      clientURL: mockURL,
      serverURL: mockURL,
      hasServer: false,
      hasClient: true,
    });

    // should only call webpackCompiler once
    expect(webpackCompiler.mock.calls).toHaveLength(1);
    // should call webpackCompiler with client config
    expect(webpackCompiler.mock.calls[0][0]).toEqual('clientConfig');
  });

  it('runs correctly in server-only mode', async () => {
    await dev({
      clientURL: mockURL,
      serverURL: mockURL,
      hasServer: true,
      hasClient: false,
    });

    // should only call webpackCompiler once
    expect(webpackCompiler.mock.calls).toHaveLength(1);
    // should call webpackCompiler with server config
    expect(webpackCompiler.mock.calls[0][0]).toEqual('serverConfig');
  });
});
