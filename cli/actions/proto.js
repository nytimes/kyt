/**
 * Sets up a component prototyping dev server
 *
 */
const chalk = require('chalk');
const logger = console;
const path = require('path');
const shell = require('shelljs');
const configBuilder = require('../../configBuilder');
const WebpackDevServer = require('webpack-dev-server');

module.exports = (program) => {
  const args = program.args[0];
  const defaultPort = 3333;
  console.log(chalk.blue('Starting prototype dev server'));
  const port = args.port ? args.port : defaultPort;
  const options = {
    environment: 'proto',
    port: port
  };
  // Build webpack config
  process.env.KYT_OPTIONS = JSON.stringify(options);
  const webConfigs = configBuilder(args.config || '', options);

      // Optional Flag to print config for debugging
      if (args.printConfig) {
        logger.dir(webConfigs.webpackConfig, { depth: 8 });
      } else {
        /*
         * Creates a webpack dev server at the specified port
        */
        const server = new WebpackDevServer(webConfigs.webpackCompiler, webConfigs.webpackConfig.devServer);
        server.listen(port, 'localhost', () => {
          logger.log(chalk.green('webpack-dev-server http://localhost:' + port));
        });
      }
};
