
// Command to build production code

const shell = require('shelljs');
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
    logger.task('Cleaned ./build');
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
