
// Command to build production code

const shell = require('shelljs');
const path = require('path');
const logger = require('./../logger');
const printAssets = require('../../utils/printAssets');
const buildConfigs = require('../../utils/buildConfigs');
const webpackCompiler = require('../../utils/webpackCompiler');

module.exports = () => {
  logger.start('Starting production build...');

  let serverCompiler;

  const {
    clientConfig,
    serverConfig,
    userRootPath,
  } = buildConfigs('production');

  // Clean the build directory.
  if (shell.exec(`rm -rf ${userRootPath}/build`).code === 0) {
    shell.mkdir(`${userRootPath}/build`);
    logger.task('Cleaned ./build');
  }

  // Copy public folder into build
  const userPublicPath = path.resolve(userRootPath, './src/public');
  const buildPublicPath = path.resolve(userRootPath, './build/public');
  if (shell.test('-d', userPublicPath )) {

    // Create build folder if it doesnt exist
    if (!shell.test('-d', path.resolve(userRootPath, './build'))) {
      shell.mkdir(`${userRootPath}/build`);
    }

    // copy files
    shell.cp('-r', userPublicPath, buildPublicPath);
    logger.task('Copied /src/public to /build/public');
  }

  // Compiles server code using the prod.server config
  const buildServer = () => {
    serverCompiler = webpackCompiler(serverConfig, () => {
      logger.end('Done building');
    });
    serverCompiler.run(() => undefined);
  };

  const clientCompiler = webpackCompiler(clientConfig, stats => {
    logger.info('Assets:');
    printAssets(stats);
    buildServer();
  });
  clientCompiler.run(() => undefined);
};
