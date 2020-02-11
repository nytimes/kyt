// Command to run development server

const shell = require('shelljs');
const WebpackDevServer = require('webpack-dev-server');
const logger = require('kyt-utils/logger');
const { buildPath } = require('kyt-utils/paths')();
const buildConfigs = require('../../utils/buildConfigs');
const webpackCompiler = require('../../utils/webpackCompiler');
const setPorts = require('../../utils/setPorts');

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = process.argv.find(arg => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT = process.argv.find(arg => arg.match(/--inspect(=|$)/)) || '';

module.exports = config => {
  logger.start('Starting development build...');

  // Kill the server on exit.
  process.on('SIGINT', process.exit);

  const { clientConfig, serverConfig } = buildConfigs(config);

  function main() {
    let clientCompiler;
    let serverCompiler;

    // Clean the build directory.
    if (shell.test('-d', buildPath) && shell.rm('-rf', buildPath).code === 0) {
      logger.task('Cleaned ./build');
    }

    if (config.hasClient) {
      // Compile Client Webpack Config
      clientCompiler = webpackCompiler(clientConfig);
    }

    // Compile Server Webpack Config
    if (config.hasServer) {
      serverCompiler = webpackCompiler(serverConfig);
    }

    // Instatiate a variable to track server watching
    let watching;

    // Start our server webpack instance in watch mode after assets compile
    clientCompiler.plugin('done', () => {
      // If we've already started the server watcher, bail early.
      if (watching || !config.hasServer) {
        return;
      }
      // Otherwise, create a new watcher for our server code.
      watching = serverCompiler.watch(
        {
          quiet: true,
          stats: 'none',
        },
        // eslint-disable-next-line no-unused-vars
        stats => {}
      );
    });

    // Create a new instance of Webpack-dev-server for our client assets.
    // This will actually run on a different port than the users app.
    const clientDevServer = new WebpackDevServer(clientCompiler, clientConfig.devServer);

    // Start Webpack-dev-server
    clientDevServer.listen(parseInt(process.env.PORT_DEV, 10) || 3001, err => {
      if (err) {
        logger.error(err);
      }
    });
  }

  setPorts(config)
    .then(main)
    .catch(console.error);
};
