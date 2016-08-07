
// Command to run prorotype dev server

const logger = require('./../logger');
const path = require('path');
const kytConfig = require('./../../config/kyt.config');
const baseConfig = require('./../../config/webpack.base');
const protoConfig = require('./../../config/webpack.proto');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');


module.exports = () => {
  logger.start('Configuring Prototype...');
  const port = kytConfig.prototypePort;
  const userRootPath = path.resolve(__dirname, '../../../../');
  const options = {
    configType: 'prototype',
    environment: 'proto',
    port,
    userRootPath,
  };

  // Build webpack config
  let webpackConfig = merge.smart(baseConfig(options), protoConfig(options));
  webpackConfig = kytConfig.modifyWebpackConfig(webpackConfig, options);

  const compiler = webpack(webpackConfig);
  logger.debug('Prototype Config', webpackConfig);

  // Creates a webpack dev server at the specified port
  const server = new WebpackDevServer(compiler, webpackConfig.devServer);
  server.listen(port, 'localhost', () => {
    logger.end(`webpack-dev-server http://localhost:${port}/prototype`);
  });
};
