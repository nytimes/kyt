const assert = require('assert');

// jest.enableAutomock();
jest.mock('kyt-utils/logger');
jest.mock('kyt-utils/paths');
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
const stats = {
  hasErrors: jest.fn(),
};

const logger = require('kyt-utils/logger');
const webpackCompiler = require('../../utils/webpackCompiler');
const buildConfigs = require('../../utils/buildConfigs');

const dev = require('../dev');

describe('dev', () => {
  // this can be replaced with jest.clearAllMocks in jest 16.0.0
  beforeEach(() => {
    [webpackCompiler, buildConfigs].forEach(mock => mock.mockClear());
  });

  const href = { href: 'href' };
  const port = 1000;
  const hostname = 'hostname';
  const mockURL = { href, port, hostname };

  require('../dev')(
    {
      clientURL: mockURL,
      serverURL: mockURL,
      hasClient: true,
    },
    []
  );

  it('runs correctly with a server enabled', () => {
    dev(
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
    const clientCompilerDone = webpackCompiler.mock.calls[0][1];
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'clientConfig',
      'first call to webpackCompiler should be client compilation'
    );
    assert.equal(
      typeof clientCompilerDone,
      'function',
      'second arg for client webpackCompiler should be a callback'
    );

    // serverCompiler
    const serverCompilerDone = webpackCompiler.mock.calls[1][1];
    assert.equal(
      webpackCompiler.mock.calls[1][0],
      'serverConfig',
      'second call to webpackCompiler should be server compilation'
    );
    assert.equal(
      typeof serverCompilerDone,
      'function',
      'second arg for server webpackCompiler should be a callback'
    );

    clientCompilerDone(stats);

    assert.equal(
      logger.task.mock.calls[2][0],
      'Client assets serving from publicPath',
      'should log a message about client server'
    );

    serverCompilerDone(stats);
  });

  it('runs correctly in client-only mode', () => {
    dev({
      clientURL: mockURL,
      serverURL: mockURL,
      hasServer: false,
      hasClient: true,
    });

    const clientDone = webpackCompiler.mock.calls[0][1];
    clientDone({ hasErrors: jest.fn() });

    assert.equal(webpackCompiler.mock.calls.length, 1, 'should only call webpackCompiler once');
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'clientConfig',
      'should call webpackCompiler with client config'
    );
  });

  it('runs correctly in server-only mode', () => {
    dev({
      clientURL: mockURL,
      serverURL: mockURL,
      hasServer: true,
      hasClient: false,
    });

    const serverDone = webpackCompiler.mock.calls[0][1];
    serverDone({ hasErrors: jest.fn() });

    assert.equal(webpackCompiler.mock.calls.length, 1, 'should only call webpackCompiler once');
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'serverConfig',
      'should call webpackCompiler with server config'
    );
  });

  it('handles multiple server entries', () => {
    require('../../utils/webpackCompiler').configureOptionsType('multiEntry');
    const compiler = require('../../utils/webpackCompiler');

    require('../dev')(
      {
        clientURL: mockURL,
        serverURL: mockURL,
        hasServer: true,
        hasClient: true,
      },
      []
    );

    const serverCompilerDone = compiler.mock.calls[1][1];
    serverCompilerDone(stats);
  });

  it('handles multiple server string literal entries', () => {
    require('../../utils/webpackCompiler').configureOptionsType('stringEntry');
    const compiler = require('../../utils/webpackCompiler');

    require('../dev')(
      {
        clientURL: mockURL,
        serverURL: mockURL,
        hasServer: true,
        hasClient: true,
      },
      []
    );

    const serverCompilerDone = compiler.mock.calls[1][1];
    serverCompilerDone(stats);
  });
});
