const assert = require('assert');

// jest.enableAutomock();
jest.mock('kyt-utils/logger');
jest.mock('kyt-utils/paths');
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

    assert.deepEqual(
      logger.task.mock.calls[0],
      ['Cleaned ./build'],
      'should log that it cleaned the build directory'
    );

    // watches files for server restarting
    // client dev server
    assert.ok(webpackCompiler.mock.calls.length > 0, 'should call webpackCompiler');
    assert.ok(buildConfigs.mock.calls.length > 0, 'should call buildConfigs');

    // clientCompiler
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'clientConfig',
      'first call to webpackCompiler should be client compilation'
    );

    // serverCompiler
    assert.equal(
      webpackCompiler.mock.calls[1][0],
      'serverConfig',
      'second call to webpackCompiler should be server compilation'
    );
  });

  it('runs correctly in client-only mode', async () => {
    await dev({
      clientURL: mockURL,
      serverURL: mockURL,
      hasServer: false,
      hasClient: true,
    });

    assert.equal(webpackCompiler.mock.calls.length, 1, 'should only call webpackCompiler once');
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'clientConfig',
      'should call webpackCompiler with client config'
    );
  });

  it('runs correctly in server-only mode', async () => {
    await dev({
      clientURL: mockURL,
      serverURL: mockURL,
      hasServer: true,
      hasClient: false,
    });

    assert.equal(webpackCompiler.mock.calls.length, 1, 'should only call webpackCompiler once');
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'serverConfig',
      'should call webpackCompiler with server config'
    );
  });
});
