const shell = {
  exec: jest.fn(() => ({ code: 0 })),
  mkdir: jest.fn(),
  test: jest
    .fn(() => true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(false),
  cp: jest.fn(),
  rm: jest.fn(() => ({ code: 0 })),
};

jest.setMock('shelljs', shell);
jest.mock('kyt-utils/paths');
jest.mock('kyt-utils/logger');
jest.mock('../../utils/printAssets');
jest.mock('../../utils/buildConfigs');
jest.mock('../../utils/webpackCompiler');

global.process.exit = jest.fn();

const logger = require('kyt-utils/logger');
const { buildPath, publicBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const printAssets = require('../../utils/printAssets');
const webpackCompiler = require('../../utils/webpackCompiler');
const build = require('../build');
const buildConfigs = require('../../utils/buildConfigs');

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
    const testConfig = { test: 'test', hasServer: true, hasClient: true };

    build(testConfig);

    // should log start
    expect(logger.start.mock.calls[0][0]).toEqual('Starting production build...');

    // builds production configuration
    expect(buildConfigs.mock.calls[0][0]).toEqual(testConfig);
    expect(buildConfigs.mock.calls[0][1]).toEqual('production');

    // should clean build directory...
    expect(shell.rm.mock.calls[0][0]).toEqual('-rf');
    expect(shell.rm.mock.calls[0][1]).toEqual(buildPath);

    // should recreate build directory
    expect(shell.mkdir.mock.calls[0][0]).toEqual(buildPath);

    // should log that build was cleaned
    expect(logger.task.mock.calls[0][0]).toEqual('Cleaned ./build');

    // should check public src path
    expect(shell.test.mock.calls[0][0]).toEqual('-d');
    expect(shell.test.mock.calls[0][1]).toEqual(publicSrcPath);

    // should check build path
    expect(shell.test.mock.calls[1][0]).toEqual('-d');
    expect(shell.test.mock.calls[1][1]).toEqual(buildPath);

    // should mkdir buildPath
    expect(shell.mkdir.mock.calls[1][0]).toEqual(buildPath);

    // should copy public src to public build
    expect(shell.cp.mock.calls[0][0]).toEqual('-r');
    expect(shell.cp.mock.calls[0][1]).toEqual(publicSrcPath);
    expect(shell.cp.mock.calls[0][2]).toEqual(publicBuildPath);

    // should log that it copied public src to public build
    expect(logger.task.mock.calls[1][0]).toEqual('Copied /src/public to /build/public');

    // should call webpackCompiler with clientConfig
    expect(webpackCompiler.mock.calls[0][0]).toEqual('clientConfig');

    // should call webpackCompiler.run
    expect(webpackCompiler.run.mock.calls.length > 0).toBe(true);

    // client stats
    const clientCallback = webpackCompiler.mock.calls[0][1];

    // clientCallback should be a function
    expect(typeof clientCallback).toEqual('function');

    const stats = {
      hasErrors: jest.fn(),
    };
    clientCallback(stats);

    // should call logger.info
    expect(logger.info.mock.calls[0][0]).toEqual('Assets:');
    // should call printAssets'
    expect(printAssets.mock.calls[0][0]).toEqual(stats);
    expect(printAssets.mock.calls[0][1]).toEqual('clientConfig');

    // for server
    const doneBuilding = webpackCompiler.mock.calls[1][1];

    // should call webpackCompiler with serverConfig second
    expect(webpackCompiler.mock.calls[1][0]).toEqual('serverConfig');

    // done building server
    doneBuilding(stats);

    // should log success
    expect(logger.end.mock.calls[0][0]).toEqual('Done building');
  });

  it('builds correctly without a server', () => {
    build({ test: 'test', hasServer: false, hasClient: true });

    // should call webpackCompiler with clientConfig
    expect(webpackCompiler.mock.calls[0][0]).toEqual('clientConfig');
    // should call webpackCompiler.run
    expect(webpackCompiler.run.mock.calls.length > 0).toBe(true);
    // should not call webpackCompiler a second time for server
    expect(webpackCompiler.mock.calls).toHaveLength(1);
  });

  it('builds correctly without a client', () => {
    build({ test: 'test', hasClient: false });

    // should call webpackCompiler with serverConfig
    expect(webpackCompiler.mock.calls[0][0]).toEqual('serverConfig');

    // should call webpackCompiler.run
    expect(webpackCompiler.run.mock.calls.length > 0).toBe(true);

    // should not call webpackCompiler a second time for client
    expect(webpackCompiler.mock.calls).toHaveLength(1);
  });

  it('exits when the client build errors', () => {
    build({ test: 'test', hasServer: true, hasClient: true });
    const clientCallback = webpackCompiler.mock.calls[0][1];
    const failingStats = {
      hasErrors: jest.fn(() => true),
    };
    clientCallback(failingStats);

    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('exits when the server build errors', () => {
    build({ test: 'test', hasServer: true, hasClient: true });
    const clientCallback = webpackCompiler.mock.calls[0][1];
    clientCallback({
      hasErrors: jest.fn(),
    });

    expect(process.exit.mock.calls).toHaveLength(0);

    const serverCallback = webpackCompiler.mock.calls[1][1];
    serverCallback({
      hasErrors: jest.fn(() => true),
    });

    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
