
// Command to run prorotype dev server
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const shell = require('shelljs');
const logger = require('./../logger');
const ifPortIsFreeDo = require('./../../utils/ifPortIsFreeDo');
const baseConfig = require('./../../config/webpack.base');
const protoConfig = require('./../../config/webpack.proto');
const { userPrototypePath, publicSrcPath } = require('../../utils/paths')();

module.exports = config => {
  const port = config.prototypePort;
  const options = {
    type: 'prototype',
    environment: 'prototype',
    port,
    publicDir: publicSrcPath,
    clientAssetsFile: 'publicAssets.json',
  };

  const startPrototype = () => {
    // Build webpack config
    let webpackConfig = merge.smart(baseConfig(options), protoConfig(options));
    webpackConfig = config.modifyWebpackConfig(webpackConfig, options);

    // Preparing prototype compiler
    let compiler = null;
    try {
      if (config.debug) logger.debug('Prototype Config', webpackConfig);
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

  if (!shell.test('-f', userPrototypePath)) {
    logger.error('Prototype.js entry file does not exist.');
    logger.error('See the kyt Readme for details.');
    process.exit();
  }

  ifPortIsFreeDo(port, startPrototype);
};
