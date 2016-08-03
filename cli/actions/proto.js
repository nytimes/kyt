/**
 * Sets up a component prototyping dev server
 *
 */
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
  logger.start('Starting prototype dev server');
  const port = kytConfig.prototypePort;
  const basePath = path.resolve(__dirname, '../../../../');
  const options = {
    environment: 'proto',
    port: port,
    basePath
  };

  // Build webpack config
  const webpackConfig = merge.smart(baseConfig(options), protoConfig(options));
  const compiler = webpack(webpackConfig);
      // Optional Flag to print config for debugging
      if (kytConfig.debug) {
        logger.debug('Prototype Config', webpackConfig);
      }
      /*
       * Creates a webpack dev server at the specified port
      */
      const server = new WebpackDevServer(compiler, webpackConfig.devServer);
      server.listen(port, 'localhost', () => {
        logger.end('webpack-dev-server http://localhost:' + port + '/prototype');
      });
};
