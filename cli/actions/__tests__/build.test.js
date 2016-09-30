const assert = require('assert');

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

const submodules = mod => Object.keys(mod).map(key => mod[key]);

describe('build', () => {
  // can replace this with jest.clearAllMocks when it lands in 16.0.0
  beforeEach(() => {
    [
      ...submodules(shell),
      printAssets,
      webpackCompiler,
      webpackCompiler.run,
      ...submodules(logger),
      buildConfigs,
    ].forEach(mock => mock.mockClear());
  });

  it('builds correctly with a server', () => {
    const testConfig = { test: 'test' };

    build(testConfig);

    assert.deepEqual(logger.start.mock.calls, [['Starting production build...']],
      'should log start');
    assert.deepEqual(buildConfigs.mock.calls, [[testConfig, 'production']],
      'builds production configuration');

    assert.ok(/^rm -rf/.test(shell.exec.mock.calls[0][0]),
      'should clean build directory...');
    assert.deepEqual(shell.mkdir.mock.calls[0], [buildPath],
      'should recreate build directory');
    assert.deepEqual(logger.task.mock.calls[0], ['Cleaned ./build'],
      'should log that build was cleaned');

    assert.deepEqual(shell.test.mock.calls[0], ['-d', publicSrcPath],
      'should check public src path');
    assert.deepEqual(shell.test.mock.calls[1], ['-d', buildPath],
      'should check build path');
    assert.equal(shell.mkdir.mock.calls[1], buildPath,
      'should mkdir buildPath');
    assert.deepEqual(shell.cp.mock.calls[0], ['-r', publicSrcPath, publicBuildPath],
      'should copy public src to public build');
    assert.deepEqual(logger.task.mock.calls[1], ['Copied /src/public to /build/public'],
      'should log that it copied public src to public build');

    // for client
    assert.equal(webpackCompiler.mock.calls[0][0], 'clientConfig',
      'should call webpackCompiler with clientConfig');
    assert.ok(webpackCompiler.run.mock.calls.length > 0,
      'should call webpackCompiler.run');

    // client stats
    const stats = webpackCompiler.mock.calls[0][1];
    assert.equal(typeof stats, 'function',
      'stats should be a function');
    stats('stats');
    assert.deepEqual(logger.info.mock.calls, [['Assets:']],
      'should call logger.info');
    assert.deepEqual(printAssets.mock.calls, [['stats']],
      'should call printAssets');

    // for server
    const doneBuilding = webpackCompiler.mock.calls[1][1];
    assert.equal(webpackCompiler.mock.calls[1][0], 'serverConfig',
      'should call webpackCompiler with serverConfig second');

    // done building server
    doneBuilding();
    assert.deepEqual(logger.end.mock.calls, [['Done building']],
      'should log success');
  });

  it('builds correctly without a server', () => {
    build({ test: 'test', noServer: true });
    assert.equal(webpackCompiler.mock.calls[0][0], 'clientConfig',
      'should call webpackCompiler with clientConfig');
    assert.ok(webpackCompiler.run.mock.calls.length > 0,
      'should call webpackCompiler.run');
    assert.equal(webpackCompiler.mock.calls.length, 1,
      'should not call webpackCompiler a second time for server');
  });
});
