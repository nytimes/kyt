// Command to build production code

/* eslint-disable no-console */

const shell = require('shelljs');
const logger = require('kyt-utils/logger');
const { buildPath, publicBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const printAssets = require('../../utils/printAssets');
const buildConfigs = require('../../utils/buildConfigs');
const webpackCompiler = require('../../utils/webpackCompiler');

module.exports = config => {
  logger.start('Starting production build...');

  let serverCompiler;

  const { clientConfig, serverConfig } = buildConfigs(config, 'production');

  // Clean the build directory.
  if (shell.rm('-rf', buildPath).code === 0) {
    shell.mkdir(buildPath);
    logger.task('Cleaned ./build');
  }

  // Copy public folder into build
  if (shell.test('-d', publicSrcPath)) {
    // Create build folder if it doesnt exist
    if (!shell.test('-d', buildPath)) {
      shell.mkdir(buildPath);
    }
    shell.cp('-r', publicSrcPath, publicBuildPath);
    logger.task('Copied /src/public to /build/public');
  } else {
    shell.mkdir('-p', `${buildPath}/public`);
  }

  // Compiles server code using the prod.server config
  const buildServer = () => {
    console.time('Server build');
    serverCompiler = webpackCompiler(serverConfig, stats => {
      console.timeEnd('Server build');
      if (stats.hasErrors()) process.exit(1);
      logger.end('Done building');
    });
    serverCompiler.run(() => undefined);
  };

  const clientCompiler = webpackCompiler(clientConfig, stats => {
    console.timeEnd('Client build');
    if (stats.hasErrors()) process.exit(1);
    logger.info('Assets:');
    printAssets(stats, clientConfig);
    if (config.hasServer) {
      buildServer();
    } else {
      logger.end('Done building');
    }
  });
  console.time('Client build');
  clientCompiler.run(() => undefined);
};
