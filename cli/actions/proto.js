/**
 * Sets up a component prototyping dev server
 *
 */
const logger = console;
const path = require('path');
const shell = require('shelljs');
const baseConfig = require('../../config/webpack.base.js');
const protoConfig = require('../../config/webpack.proto.js');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
console.log('made it through the imports');
module.exports = (program) => {
  const args = program.args[0];
  const defaultPort = 3333;
  logger.log('Starting prototype dev server');
  const port = args.port ? args.port : defaultPort;
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
      if (args.printConfig) {
        logger.dir(webpackConfig, { depth: 8 });
      } else {
        /*
         * Creates a webpack dev server at the specified port
        */
        const server = new WebpackDevServer(compiler, webpackConfig.devServer);
        server.listen(port, 'localhost', () => {
          logger.log('webpack-dev-server http://localhost:' + port + '/prototype');
        });
      }
};
