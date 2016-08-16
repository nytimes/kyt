
// Command to run prorotype dev server
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const shell = require('shelljs');
const logger = require('./../logger');
const detectPort = require('./../../utils/detectPort');
const kytConfig = require('./../../config/kyt.config');
const baseConfig = require('./../../config/webpack.base');
const protoConfig = require('./../../config/webpack.proto');

module.exports = () => {
  const port = kytConfig.prototypePort;
  const userRootPath = kytConfig.userRootPath;
  const options = {
    type: 'prototype',
    environment: 'prototype',
    port,
    userRootPath,
  };

  const startPrototype = () => {
    // Build webpack config
    let webpackConfig = merge.smart(baseConfig(options), protoConfig(options));
    webpackConfig = kytConfig.modifyWebpackConfig(webpackConfig, options);

    // Preparing prototype compiler
    let compiler = null;
    try {
      logger.debug('Prototype Config', webpackConfig);
      compiler = webpack(webpackConfig);
    } catch (error) {
      logger.error('Webpack config is invalid\n', error);
      process.exit();
    }

    // Creates a webpack dev server at the specified port
    const server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(port, 'localhost', () => {
      logger.end(`webpack-dev-server http://localhost:${port}/prototype`);
    });
  };
  logger.start('Configuring Prototype...');

  const userPrototypePath = path.join(userRootPath, './prototype.js');
  if (!shell.test('-f', userPrototypePath)) {
    logger.error('Prototype.js entry file does not exist.');
    logger.error('See the kyt Readme for details.');
    process.exit();
  }

  detectPort.isPortFree(port, (portFree) => {
    if (portFree) {
      startPrototype();
    } else {
      process.exit();
    }
  })
};
