const assert = require('assert');

const shell = {
  exec: jest.fn(() => ({ code: 0 })),
  mkdir: jest.fn(),
  test: jest.fn(() => true).mockReturnValueOnce(true).mockReturnValueOnce(false),
  cp: jest.fn(),
  rm: jest.fn(() => ({ code: 0 })),
};

jest.setMock('shelljs', shell);
jest.mock('kyt-utils/paths');
jest.mock('kyt-utils/logger');
jest.mock('../../../utils/printAssets');
jest.mock('../../../utils/buildConfigs');
jest.mock('../../../utils/webpackCompiler');

global.process.exit = jest.fn();

const printAssets = require('../../../utils/printAssets');
const webpackCompiler = require('../../../utils/webpackCompiler');
const logger = require('kyt-utils/logger');
const build = require('../build');
const buildConfigs = require('../../../utils/buildConfigs');
const { buildPath, publicBuildPath, publicSrcPath } = require('kyt-utils/paths')();

const submodules = mod => Object.keys(mod).map(key => mod[key]);

describe('build', () => {
  // this can be replaced with jest.clearAllMocks in jest 16.0.0
  beforeEach(() => {
    [
      ...submodules(shell),
      printAssets,
      webpackCompiler,
      webpackCompiler.run,
      ...submodules(logger),
      buildConfigs,
      global.process.exit,
    ].forEach(mock => mock.mockClear());
  });

  it('builds correctly with a server', () => {
    const testConfig = { test: 'test', hasServer: true };

    build(testConfig);

    assert.deepEqual(
      logger.start.mock.calls,
      [['Starting production build...']],
      'should log start'
    );
    assert.deepEqual(
      buildConfigs.mock.calls,
      [[testConfig, 'production']],
      'builds production configuration'
    );

    assert.deepEqual(shell.rm.mock.calls[0], ['-rf', buildPath], 'should clean build directory...');
    assert.deepEqual(shell.mkdir.mock.calls[0], [buildPath], 'should recreate build directory');
    assert.deepEqual(
      logger.task.mock.calls[0],
      ['Cleaned ./build'],
      'should log that build was cleaned'
    );

    assert.deepEqual(
      shell.test.mock.calls[0],
      ['-d', publicSrcPath],
      'should check public src path'
    );
    assert.deepEqual(shell.test.mock.calls[1], ['-d', buildPath], 'should check build path');
    assert.equal(shell.mkdir.mock.calls[1], buildPath, 'should mkdir buildPath');
    assert.deepEqual(
      shell.cp.mock.calls[0],
      ['-r', publicSrcPath, publicBuildPath],
      'should copy public src to public build'
    );
    assert.deepEqual(
      logger.task.mock.calls[1],
      ['Copied /src/public to /build/public'],
      'should log that it copied public src to public build'
    );

    // for client
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'clientConfig',
      'should call webpackCompiler with clientConfig'
    );
    assert.ok(webpackCompiler.run.mock.calls.length > 0, 'should call webpackCompiler.run');

    // client stats
    const clientCallback = webpackCompiler.mock.calls[0][1];
    assert.equal(typeof clientCallback, 'function', 'clientCallback should be a function');
    const stats = {
      hasErrors: jest.fn(),
    };
    clientCallback(stats);
    assert.deepEqual(logger.info.mock.calls, [['Assets:']], 'should call logger.info');
    assert.deepEqual(printAssets.mock.calls, [[stats, 'clientConfig']], 'should call printAssets');

    // for server
    const doneBuilding = webpackCompiler.mock.calls[1][1];
    assert.equal(
      webpackCompiler.mock.calls[1][0],
      'serverConfig',
      'should call webpackCompiler with serverConfig second'
    );

    // done building server
    doneBuilding(stats);
    assert.deepEqual(logger.end.mock.calls, [['Done building']], 'should log success');
  });

  it('builds correctly without a server', () => {
    build({ test: 'test', hasServer: false });
    assert.equal(
      webpackCompiler.mock.calls[0][0],
      'clientConfig',
      'should call webpackCompiler with clientConfig'
    );
    assert.ok(webpackCompiler.run.mock.calls.length > 0, 'should call webpackCompiler.run');
    assert.equal(
      webpackCompiler.mock.calls.length,
      1,
      'should not call webpackCompiler a second time for server'
    );
  });

  it('exits when the client build errors', () => {
    build({ test: 'test', hasServer: true });
    const clientCallback = webpackCompiler.mock.calls[0][1];
    const failingStats = {
      hasErrors: jest.fn(() => true),
    };
    clientCallback(failingStats);
    expect(process.exit).toBeCalledWith(1);
  });

  it('exits when the server build errors', () => {
    build({ test: 'test', hasServer: true });
    const clientCallback = webpackCompiler.mock.calls[0][1];
    clientCallback({
      hasErrors: jest.fn(),
    });
    expect(process.exit.mock.calls.length).toEqual(0);

    const serverCallback = webpackCompiler.mock.calls[1][1];
    serverCallback({
      hasErrors: jest.fn(() => true),
    });
    expect(process.exit).toBeCalledWith(1);
  });
});
