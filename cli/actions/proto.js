
// Command to run prorotype dev server

const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const logger = require('./../logger');
const kytConfig = require('./../../config/kyt.config');
const baseConfig = require('./../../config/webpack.base');
const protoConfig = require('./../../config/webpack.proto');
module.exports = () => {
  logger.start('Configuring Prototype...');
  const port = kytConfig.prototypePort;
  const userRootPath = kytConfig.userRootPath;
  const options = {
    type: 'prototype',
    environment: 'prototype',
    port,
    userRootPath,
  };

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
