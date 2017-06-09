// Command to run prototype dev server
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const shell = require('shelljs');
const logger = require('kyt-utils/logger');
const ifPortIsFreeDo = require('./../../utils/ifPortIsFreeDo');
const baseConfig = require('./../../config/webpack.base');
const protoConfig = require('./../../config/webpack.proto');
const { userPrototypePath, publicSrcPath } = require('kyt-utils/paths')();

module.exports = config => {
  const prototypeURL = config.prototypeURL;
  let server;

  // Kill the server on exit.
  process.on('SIGINT', () => {
    server.close();
    process.exit();
  });

  const options = {
    type: 'prototype',
    environment: 'prototype',
    port: prototypeURL.port,
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
    server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(prototypeURL.port, prototypeURL.hostname, () => {
      logger.end(`webpack-dev-server ${prototypeURL.href}prototype`);
    });
  };
  logger.start('Configuring Prototype...');

  if (!shell.test('-f', userPrototypePath)) {
    logger.error('Prototype.js entry file does not exist.');
    logger.error('See the kyt Readme for details.');
    process.exit();
  }

  ifPortIsFreeDo(prototypeURL.port, startPrototype);
};
