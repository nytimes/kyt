
// Command to run prorotype dev server

const logger = require('../logger');
const path = require('path');
const shell = require('shelljs');
const kytConfig = require('../../config/kyt.config.js');
const baseConfig = require('../../config/webpack.base.js');
const protoConfig = require('../../config/webpack.proto.js');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');


module.exports = (program) => {
  const args = program.args[0];
  logger.start('Configuring Prototype...');
  const port = kytConfig.prototypePort;
  const userRootPath = path.resolve(__dirname, '../../../../');
  const options = {
    configType: 'prototype',
    environment: 'proto',
    port: port,
    userRootPath
  };

  // Build webpack config
  let webpackConfig = merge.smart(baseConfig(options), protoConfig(options));

  // modify webpack config
  webpackConfig = kytConfig.modifyWebpackConfig(webpackConfig, options);
  logger.task('Modified webpack config');

  const compiler = webpack(webpackConfig);
  logger.debug('Prototype Config', webpackConfig);

  /*
  * Creates a webpack dev server at the specified port
  */
  const server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(port, 'localhost', () => {
    logger.end('webpack-dev-server http://localhost:' + port + '/prototype');
    });
  };
