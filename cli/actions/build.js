
// Command to build production code

const shell = require('shelljs');
const path = require('path');
const logger = require('./../logger');
const printAssets = require('../../utils/printAssets');
const buildConfigs = require('../../utils/buildConfigs');
const webpackCompiler = require('../../utils/webpackCompiler');

module.exports = (program) => {
  logger.start('Starting production build...');

  let serverCompiler;

  const {
    clientConfig,
    serverConfig,
    userRootPath,
  } = buildConfigs('production');

  // Clean the build directory.
  const buildPath = path.resolve(userRootPath, './build');

  if (shell.exec(`rm -rf ${buildPath}`).code === 0) {
    shell.mkdir(buildPath);
    logger.task('Cleaned ./build');
  }

  // Copy public folder into build
  const userPublicPath = path.resolve(userRootPath, './src/public');
  const buildPublicPath = path.resolve(buildPath, './public');

  if (shell.test('-d', userPublicPath)) {
    // Create build folder if it doesnt exist
    if (!shell.test('-d', buildPath)) {
      shell.mkdir(buildPath);
    }
    // copy files
    shell.cp('-r', userPublicPath, buildPublicPath);
    logger.task('Copied /src/public to /build/public');
  } else {
    shell.mkdir('-p', `${buildPath}/public`);
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
