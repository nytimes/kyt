
// Command to run tests with Ava
const clone = require('ramda').clone;
const path = require('path');
const glob = require('glob');
const logger = require('./../logger');
const shell = require('shelljs');
const merge = require('webpack-merge');
let testConfig = require('../../config/webpack.test');
const baseConfig = require('../../config/webpack.base');
const webpackCompiler = require('../../utils/webpackCompiler');
const {
  userRootPath,
  testBuildPath,
  srcPath,
  userNodeModulesPath,
} = require('../../utils/paths')();

const jest = require('jest');
const jestConfigBuilder = require('../../config/jest');

module.exports = () => {
  // Comment the following to see verbose shell ouput.
  shell.config.silent = false;

  // explicitly set BABEL_ENV to test to pick up the proper babel config
  process.env.BABEL_ENV = 'test';

  let jestConfig = jestConfigBuilder(srcPath);
  jestConfig = global.config.modifyJestConfig(clone(jestConfig), { environment: 'test' });

  // TODO Remove --no-cache
  // TODO Add --watch support
  jest.run(['--config', JSON.stringify(jestConfig), '--watch']);

  // TODO: Delete everything below this
  return;


  const avaCLI = path.join(userNodeModulesPath, '/ava/cli.js');

  if (shell.test('-d', testBuildPath) && shell.rm('-rf', testBuildPath).code === 0) {
    logger.task('Cleaned ./build/test');
  }
  shell.mkdir('-p', testBuildPath);

  // Find test files
  const getFiles = () => {
    const pattern = path.join(srcPath, '/**/*.test.js');
    return glob.sync(pattern);
  };

  // Create new file name from file path
  const getFileNameFromPath = (filePath) => (
    filePath
      .replace(/.+\/src\//, '')
      .replace(/\.test(\.js)/, '$1')
      .replace(/\.\//g, '')
      .replace(/\//g, '.')
      .split('.')
      .slice(0, -1)
      .join('_')
  );

  // Creates list of files for webpack entry
  const getFileHash = () => (
    getFiles().reduce((prev, next) => {
      prev[getFileNameFromPath(next)] = next; // eslint-disable-line no-param-reassign
      return prev;
    }, {})
  );

  // Create webpack config for testing
  const getConfig = () => {
    const options = {
      type: 'test',
      serverPort: undefined,
      clientPort: undefined,
      environment: 'test',
      publicPath: undefined,
      publicDir: undefined,
      clientAssetsFile: undefined,
    };

    let webpackConfig = null;
    try {
      const base = baseConfig(options);
      const babelLoader = base.module.loaders.find(loader => loader.loader === 'babel-loader');
      babelLoader.compact = true;
      webpackConfig = merge.smart(base, testConfig(options));
      webpackConfig = global.config.modifyWebpackConfig(webpackConfig, options);
      logger.debug('Test Webpack Config ', webpackConfig);
    } catch (error) {
      logger.error('Error Loading the Test Webpack Config', error);
      process.exit();
    }
    return webpackConfig;
  };

  logger.start('Running Test Command...');

  testConfig = getConfig();
  testConfig.entry = getFileHash();

  const compiler = webpackCompiler(testConfig, () => {
    logger.info('Starting test...');

    let command =
      `NODE_PATH=$NODE_PATH:${userNodeModulesPath} node ${avaCLI} ${userRootPath}/build/test/*.js`;
    if (global.config.debug) command += ' --verbose';
    shell.config.silent = false;
    shell.exec(command, (code) => {
      process.exit(code);
    });
  });


  logger.info('Compiling...');
  compiler.run(() => undefined);
};
