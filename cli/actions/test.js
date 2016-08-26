
// Command to run tests with Ava

const path = require('path');
const glob = require('glob');
const logger = require('./../logger');
const shell = require('shelljs');
const merge = require('webpack-merge');
const kytConfig = require('./../../config/kyt.config');
let testConfig = require('../../config/webpack.test');
let baseConfig = require('../../config/webpack.base');
const webpackCompiler = require('../../utils/webpackCompiler');


module.exports = () => {
  // Comment the following to see verbose shell ouput.
  shell.config.silent = true;

  const userRootPath = kytConfig.userRootPath;
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
  const getFileNameFromPath = (filePath) => {
    return filePath.replace(/.+\/src\//, '')
      .replace(/\.\//g, '')
      .replace(/\//g, '.')
      .split('.')
      .slice(0, -1)
      .join('_');
  };

  // Creates list of files for webpack entry
  const getFileHash = (files) => {
    return getFiles().reduce(function (prev, next) {
      const path = './' + next;
      prev[getFileNameFromPath(next)] = next;
      return prev;
    }, {});
  }

  // Create webpack config for testing
  const getConfig = () => {
    const { clientPort, serverPort} = kytConfig;
    const buildPath = path.join(userRootPath, 'build');
    const options = {
      buildPath,
      type: 'test',
      serverPort,
      clientPort,
      environment: 'test',
      buildPath,
      publicPath: `http://localhost:${clientPort}/assets/`,
      publicDir: path.join(userRootPath, 'src/public'),
      clientAssetsFile: 'publicAssets.json',
      userRootPath,
    };
    let webpackConfig = null;
    try {
      webpackConfig = merge.smart(baseConfig(options), testConfig(options));
      webpackConfig = kytConfig.modifyWebpackConfig(webpackConfig, options);
    } catch (error) {
      logger.log('Error Loading the Test Webpack Config', error);
    }
    return webpackConfig;
  }

  logger.start('Running Test Command...');

  testConfig = getConfig();
  testConfig.entry = getFileHash();

  const compiler = webpackCompiler(testConfig, (stats) => {
    logger.info('Starting test...');

    let command = `NODE_PATH=$NODE_PATH:${npath} node ${avaCLI} ${userRootPath}/build/test/*.js`;
    if (kytConfig.debug) command += ' --verbose';

    shell.config.silent = false;
    shell.exec(command);
  });

  logger.info('Compiling...')
  compiler.run(() => undefined);
};
