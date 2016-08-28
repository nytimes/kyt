
// Command to run tests with Ava

const path = require('path');
const glob = require('glob');
const logger = require('./../logger');
const shell = require('shelljs');
const merge = require('webpack-merge');
let testConfig = require('../../config/webpack.test');
const baseConfig = require('../../config/webpack.base');
const webpackCompiler = require('../../utils/webpackCompiler');

module.exports = () => {
  // Comment the following to see verbose shell ouput.
  shell.config.silent = true;

  const userRootPath = global.config.userRootPath;
  const userSrc = path.join(userRootPath, 'src');
  const userBuild = path.join(userRootPath, 'build/test');
  const avaCLI = path.resolve(userRootPath, './node_modules/ava/cli.js');
  const npath = path.resolve(userRootPath, './node_modules');

  if (shell.test('-d', userBuild) && shell.rm('-rf', userBuild).code === 0) {
    logger.task('Cleaned ./build/test');
  }
  shell.mkdir('-p', userBuild);

  // Find test files
  const getFiles = () => {
    const pattern = path.join(userRootPath, '/src/**/*.test.js');
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
    const buildPath = path.join(userRootPath, 'build');
    const options = {
      buildPath,
      type: 'test',
      serverPort: undefined,
      clientPort: undefined,
      environment: 'test',
      publicPath: undefined,
      publicDir: undefined,
      clientAssetsFile: undefined,
      userRootPath,
    };

    let webpackConfig = null;
    try {
      const base = baseConfig(options);
      const babelLoader = base.module.loaders.find(loader => loader.loader === 'babel-loader');
      babelLoader.compact = true;
      webpackConfig = merge.smart(base, testConfig(options));
      webpackConfig = global.config.modifyWebpackConfig(webpackConfig, options);
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

    let command = `NODE_PATH=$NODE_PATH:${npath} node ${avaCLI} ${userRootPath}/build/test/*.js`;
    if (global.config.debug) command += ' --verbose';
    shell.config.silent = false;
    shell.exec(command);
  });


  logger.info('Compiling...');
  compiler.run(() => undefined);
};
