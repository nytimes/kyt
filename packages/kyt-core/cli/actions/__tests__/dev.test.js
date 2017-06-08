/* eslint-disable global-require */

const assert = require('assert');

// jest.enableAutomock();
jest.mock('webpack-dev-middleware');
jest.mock('webpack-hot-middleware');
jest.mock('kyt-utils/logger');
jest.mock('kyt-utils/paths');
jest.mock('../../../utils/buildConfigs');
jest.mock('../../../utils/webpackCompiler');
jest.mock('express');
jest.mock('../../../utils/ifPortIsFreeDo');
jest.setMock('path', {
  resolve: p => p,
  join: (p, q) => p + q,
});
jest.mock('nodemon');
jest.mock('chokidar');
jest.setMock('shelljs', {
  test: () => true,
  rm: () => ({ code: 0 }),
});
const stats = {
  hasErrors: jest.fn(),
};

const chokidar = require('chokidar');
const nodemon = require('nodemon');
const devMiddleware = require('webpack-dev-middleware');
const express = require('express');
const logger = require('kyt-utils/logger');
const ifPortIsFreeDo = require('../../../utils/ifPortIsFreeDo');
const webpackCompiler = require('../../../utils/webpackCompiler');
const buildConfigs = require('../../../utils/buildConfigs');

const dev = require('../dev');

describe('dev', () => {
  // this can be replaced with jest.clearAllMocks in jest 16.0.0
  beforeEach(() => {
    [
      chokidar,
      chokidar.on,
      chokidar.watch,
      nodemon,
      nodemon.on,
      nodemon.once,
      devMiddleware,
      express,
      express.use,
      express.listen,
      express.static,
      ifPortIsFreeDo,
      webpackCompiler,
      buildConfigs,
    ].forEach(mock => mock.mockClear());
  });

  const href = { href: 'href' };
  const port = 1000;
  const hostname = 'hostname';
  const mockURL = { href, port, hostname };

  require('../dev')(
    {
      clientURL: mockURL,
      serverURL: mockURL,
      reactHotLoader: false,
    },
    []
  );

  it('runs correctly with a server enabled', () => {
    dev(
      {
        clientURL: mockURL,
        serverURL: mockURL,
        reactHotLoader: false,
        hasServer: true,
      },
      []
    );

    assert.deepEqual(
      logger.task.mock.calls[0],
      ['Cleaned ./build'],
      'should log that it cleaned the build directory'
    );

    // watches files for server restarting
    const ready = chokidar.on.mock.calls[0][1];
    assert.equal(typeof ready, 'function', 'ready should be a function');
    ready();
    assert.equal(chokidar.on.mock.calls.length, 6, 'should set up listeners with chokidar.on');

    // client dev server
    assert.ok(ifPortIsFreeDo.mock.calls.length > 0, 'should call ifPortIsFreeDo');
    assert.ok(webpackCompiler.mock.calls.length > 0, 'should call webpackCompiler');
    assert.ok(buildConfigs.mock.calls.length > 0, 'should call buildConfigs');

    // start client
    assert.ok(devMiddleware.mock.calls.length > 0, 'should call devMiddleware');
    assert.ok(express.mock.calls.length > 0, 'should instantiate express');
    assert.equal(express.use.mock.calls.length, 2, 'should set up two express middlewares');
    assert.deepEqual(
      express.listen.mock.calls,
      [[port, hostname]],
      'should call express.listen with port and hostname'
    );

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
    assert.deepEqual(
      nodemon.mock.calls[0][0],
      {
        script: 'fakePathmain.js',
        watch: ['fakePathmain.js'],
        nodeArgs: [],
      },
      'should set up nodemon with correct arguments'
    );

    // nodemon.once
    assert.equal(nodemon.once.mock.calls[0][0], 'start', 'should call nodemon.once for start');
    nodemon.once.mock.calls[0][1]();
    assert.ok(
      /Server running at:/.test(logger.task.mock.calls[3][0]),
      'should log that the server is running'
    );
    assert.equal(
      logger.end.mock.calls[0][0],
      'Development started',
      'should call logger.end with the correct message'
    );

    // on restart
    assert.equal(nodemon.on.mock.calls[0][0], 'restart', 'should set up nodemon restart listener');
    nodemon.on.mock.calls[0][1]();
    expect(logger.end).toBeCalledWith('Development server restarted');

    // on quit
    assert.equal(nodemon.on.mock.calls[1][0], 'quit', 'should set up nodemon quit listener');
  });

  it('runs correctly in client-only mode', () => {
    dev({
      clientURL: mockURL,
      serverURL: mockURL,
      reactHotLoader: false,
      hasServer: false,
    });

    const clientDone = webpackCompiler.mock.calls[0][1];
    clientDone({ hasErrors: jest.fn() });

    assert.equal(webpackCompiler.mock.calls.length, 1, 'should only call webpackCompiler once');
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'clientConfig',
      'should call webpackCompiler with client config'
    );
    assert.equal(
      chokidar.watch.mock.calls.length + chokidar.on.mock.calls.length,
      0,
      'should not set up chokidar watchers'
    );
    assert.equal(ifPortIsFreeDo.mock.calls.length, 1, 'should only call ifPortIsFreeDo once');
    assert.equal(express.static.mock.calls.length, 1, 'should call express.static once');
    assert.equal(express.use.mock.calls.length, 4, 'should set up four express middlewares');
  });

  it('handles multiple server entries', () => {
    require('../../../utils/webpackCompiler').configureOptionsType('multiEntry');
    const compiler = require('../../../utils/webpackCompiler');

    require('../dev')(
      {
        clientURL: mockURL,
        serverURL: mockURL,
        reactHotLoader: false,
        hasServer: true,
      },
      []
    );

    const serverCompilerDone = compiler.mock.calls[1][1];
    serverCompilerDone(stats);
    assert.deepEqual(
      nodemon.mock.calls[0][0],
      {
        script: 'realPathmain.js',
        watch: ['realPathmain.js', 'realPathadditional.js'],
        nodeArgs: [],
      },
      'should set up nodemon with correct arguments'
    );
  });

  it('handles multiple server string literal entries', () => {
    require('../../../utils/webpackCompiler').configureOptionsType('stringEntry');
    const compiler = require('../../../utils/webpackCompiler');

    require('../dev')(
      {
        clientURL: mockURL,
        serverURL: mockURL,
        reactHotLoader: false,
        hasServer: true,
      },
      []
    );

    const serverCompilerDone = compiler.mock.calls[1][1];
    serverCompilerDone(stats);
    assert.deepEqual(
      nodemon.mock.calls[0][0],
      {
        script: 'realPathmain.js',
        watch: ['realPathmain.js', 'realPathadditional.js'],
        nodeArgs: [],
      },
      'should set up nodemon with correct arguments'
    );
  });
});
