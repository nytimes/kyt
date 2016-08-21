
// Command to run development server

const path = require('path');
const chokidar = require('chokidar');
const express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const SingleChild = require('single-child');
const logger = require('./../logger');
const ifPortIsFreeDo = require('../../utils/ifPortIsFreeDo');
const buildConfigs = require('../../utils/buildConfigs');
const webpackCompiler = require('../../utils/webpackCompiler');

module.exports = () => {
  logger.start('Starting development build...');

  const {
    clientConfig,
    serverConfig,
    clientPort,
    serverPort,
    userRootPath,
  } = buildConfigs();

  let clientCompiler;
  let serverCompiler;
  let server = null;

  const startHotServer = () => {
    const serverPath = path.resolve(
      serverCompiler.options.output.path, `${Object.keys(serverCompiler.options.entry)[0]}.js`
    );

    try {
      if (server) {
        server.restart();
        logger.task('Development server restarted');
      } else {
        server = new SingleChild('node', [serverPath], {
          stdio: [0, 1, 2],
        });
        server.start();

        logger.task(`Server running at: http://localhost:${serverPort}`);
        logger.end('Development started');
      }
    } catch (error) {
      logger.error('Client bundle is invalid\n', error);
    }
  };

  const startHotClient = () => {
    const app = express();
    const webpackDevMiddleware = devMiddleware(clientCompiler, {
      publicPath: clientCompiler.options.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      noInfo: true,
      quiet: true,
    });

    app.use(webpackDevMiddleware);
    app.use(hotMiddleware(clientCompiler));

    app.listen(clientPort);

    logger.task(`Client server running at ${clientCompiler.options.output.publicPath}`);
  };

  const compileHotServer = () => {
    serverCompiler.run(() => undefined);
  };

  // Watch the server files and recompile and restart on changes.
  const watcher = chokidar.watch([path.join(userRootPath, 'src/server')]);
  watcher.on('ready', () => {
    watcher
      .on('add', compileHotServer)
      .on('addDir', compileHotServer)
      .on('change', compileHotServer)
      .on('unlink', compileHotServer)
      .on('unlinkDir', compileHotServer);
  });

  // Compile Client Webpack Config
  clientCompiler = webpackCompiler(clientConfig, () => {
    compileHotServer();
  });

  // Compile Server Webpack Config
  serverCompiler = webpackCompiler(serverConfig, () => {
    ifPortIsFreeDo(serverPort, startHotServer);
  });

  // Start client hot server
  ifPortIsFreeDo(clientPort, startHotClient);

};
