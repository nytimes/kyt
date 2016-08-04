
const fs = require('fs');
const chalk = require('chalk');
const logger = require('../logger');
const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const kytConfig = require('../../config/kyt.config.js');
const clientWebpackConfig = require('./../../config/webpack.prod.client');
const serverWebpackConfig = require('./../../config/webpack.prod.server');
const baseConfig = require('./../../config/webpack.base');
const merge = require('webpack-merge');

module.exports = (program) => {
  // Comment the following if you want
  // to see the verbose command ouput.
  // shell.config.silent = true;
  const args = program.args[0];
  const serverPort = kytConfig.serverPort;
  const userRootPath = path.resolve(__dirname, '../../../../');

  const clientOptions = {
    configType: 'buildClient',
    serverPort,
    clientPort: undefined,
    environment: 'production',
    publicPath: '/assets/',
    assetsPath: path.join(userRootPath, 'build/client'),
    userRootPath,
  };

  const serverOptions = merge(clientOptions, {
    assetsPath: path.join(userRootPath, 'build/server'),
    configType: 'buildServer'
  });

  let clientCompiler = null;
  let serverCompiler = null;

  let clientConfig = merge.smart(baseConfig(clientOptions), clientWebpackConfig(clientOptions));
  let serverConfig = merge.smart(baseConfig(serverOptions), serverWebpackConfig(serverOptions));

  // modify configs
  clientConfig = kytConfig.modifyWebpackConfig(clientConfig, clientOptions);
  logger.task('modify client config');
  serverConfig = kytConfig.modifyWebpackConfig(serverConfig, serverOptions);
  logger.task('modify server config');

  logger.start('Starting production build...');

  // Clean the build directory.
  if (shell.exec(`rm -rf ${userRootPath}/build`).code === 0) {
    logger.task('Cleaned ./build');
  }

  const buildServer = () => {
    try {
      logger.debug('Server webpack configuration:', serverConfig);
      serverCompiler = webpack(serverConfig);
      logger.task('Server webpack configuration compiled');
    } catch (error) {
      logger.error('Server webpack configuration is invalid\n', error)
      process.exit();
    }

    serverCompiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        logger.error('Server build failed\n', stats);
      } else {
        logger.task('Server build successful');
        logger.end('Done building');
      }
    });

    serverCompiler.run(() => undefined);
  };

  try {
    logger.debug('Client webpack configuration:', clientConfig);
    clientCompiler = webpack(clientConfig);
    logger.task('Client webpack configuration compiled');
  } catch (error) {
    logger.error('Client webpack configuration is invalid\n', error)
    process.exit();
  }

  clientCompiler.plugin('done', (stats) => {
    if (stats.hasErrors()) {
      logger.error('Client build failed\n', stats.toString());
    } else {
      logger.task('Client build successful');
      buildServer();
    }
  });

  clientCompiler.run(() => undefined);
};
