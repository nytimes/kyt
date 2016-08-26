
// Command to run tests with Ava

const path = require('path');
const glob = require('glob');
const logger = require('./../logger');
const shell = require('shelljs');
const kytConfig = require('./../../config/kyt.config');
let testConfig = require('../../config/webpack.test.js');
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

  const getFiles = () => {
    const pattern = path.join(userRootPath, '/src/**/*.test.js');
    return glob.sync(pattern);
  };

  const getFileNameFromPath = (filePath) => {
    return filePath.replace(/.+\/src\//, '')
      .replace(/\.\//g, '')
      .replace(/\//g, '.')
      .split('.')
      .slice(0, -1)
      .join('_');
  };

  const getFileHash = (files) => {
    return getFiles().reduce(function (prev, next) {
      const path = './' + next;
      prev[getFileNameFromPath(next)] = next;
      return prev;
    }, {});
  }

  logger.start('Running Test Command...');

  testConfig = testConfig();
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
