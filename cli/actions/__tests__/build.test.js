const shell = {
  exec: jest.fn(() => ({ code: 0 })),
  mkdir: jest.fn(),
  test: jest.fn(() => true).mockReturnValueOnce(true).mockReturnValueOnce(false),
  cp: jest.fn(),
};

jest.setMock('shelljs', shell);
jest.mock('../../../utils/paths');
jest.mock('../../logger');
jest.mock('../../../utils/printAssets');
jest.mock('../../../utils/buildConfigs');
jest.mock('../../../utils/webpackCompiler');

const printAssets = require('../../../utils/printAssets');
const webpackCompiler = require('../../../utils/webpackCompiler');
const logger = require('../../logger');
const build = require('../build');
const buildConfigs = require('../../../utils/buildConfigs');
const { buildPath, publicBuildPath, publicSrcPath } = require('../../../utils/paths')();

describe('build', () => {
  global.process.exit = jest.fn();
  const testConfig = { test: 'test' };

  build(testConfig);

  it('logs start', () => {
    expect(logger.start).toBeCalledWith('Starting production build...');
  });

  it('builds production configuration', () => {
    expect(buildConfigs).toBeCalledWith(testConfig, 'production');
  });

  it('cleans the build directory', () => {
    expect(shell.exec.mock.calls[0][0]).toMatch(/^rm -rf/);
    expect(shell.mkdir).toBeCalledWith(buildPath);
    expect(logger.task).toBeCalledWith('Cleaned ./build');
  });

  it('copies public folder into build', () => {
    expect(shell.test).toBeCalledWith('-d', publicSrcPath);

    expect(shell.test).toBeCalledWith('-d', buildPath);
    expect(shell.mkdir.mock.calls[1][0]).toBe(buildPath);

    expect(shell.cp).toBeCalledWith('-r', publicSrcPath, publicBuildPath);
    expect(logger.task).toBeCalledWith('Copied /src/public to /build/public');

    // TODO: test creation of public folder
  });

  it('compiles webpack configs', () => {
    const clientCallback = webpackCompiler.mock.calls[0][1];
    expect(typeof clientCallback).toBe('function');

    // for client
    expect(webpackCompiler.mock.calls[0][0]).toBe('clientConfig');
    expect(webpackCompiler.run).toBeCalled();
    const stats = {
      hasErrors: jest.fn(),
    };
    // client stats
    clientCallback(stats);
    expect(logger.info).toBeCalledWith('Assets:');
    expect(printAssets).toBeCalledWith(stats);

    // for server
    const doneBuilding = webpackCompiler.mock.calls[1][1];
    expect(webpackCompiler.mock.calls[1][0]).toBe('serverConfig');

    // done building server
    doneBuilding(stats);
    expect(logger.end).toBeCalledWith('Done building');
  });

  it('exits when the build errors', () => {
    const clientCallback = webpackCompiler.mock.calls[0][1];
    const failingStats = {
      hasErrors: jest.fn(() => true),
    };
    clientCallback(failingStats);
    expect(process.exit).toBeCalledWith(1);

    const serverCallback = webpackCompiler.mock.calls[1][1];
    serverCallback(failingStats);
    expect(process.exit).toBeCalledWith(1);
  });
});
