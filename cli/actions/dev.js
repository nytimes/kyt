
// Command to run development server

const path = require('path');
const chokidar = require('chokidar');
const express = require('express');
const shell = require('shelljs');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const SingleChild = require('single-child');
const logger = require('./../logger');
const ifPortIsFreeDo = require('../../utils/ifPortIsFreeDo');
const buildConfigs = require('../../utils/buildConfigs');
const webpackCompiler = require('../../utils/webpackCompiler');
const WebpackDevServer = require('webpack-dev-server');

module.exports = () => {
  logger.start('Starting development build...');
  // Clean the build directory.
  const buildPath = path.resolve(global.config.userRootPath, './build');

  if (shell.test('-d', buildPath) && shell.rm('-rf', buildPath).code === 0) {
    logger.task('Cleaned ./build');
  }

  const {
    clientConfig,
    serverConfig,
    clientPort,
    serverPort,
    userRootPath,
    reactHotLoader,
  } = buildConfigs();

  let isInitialServerCompile = true;
  let isInitialClientCompile = true;
  let clientCompiler;
  let serverCompiler;
  let server = null;

  const getHotClient = (options) => {
    const app = express();
    const webpackDevMiddleware = devMiddleware(clientCompiler, options);

    app.use(webpackDevMiddleware);
    app.use(hotMiddleware(clientCompiler));

    return app;
  };

  const getDevServer = (options) => new WebpackDevServer(clientCompiler, options);

  const startClient = () => {
    const devOptions = {
      publicPath: clientCompiler.options.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      noInfo: true,
      quiet: true,
    };

    const app = reactHotLoader ? getHotClient(devOptions) : getDevServer(devOptions);
    app.listen(clientPort);
  };

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
    if (isInitialClientCompile) {
      if (reactHotLoader) logger.task('Setup React Hot Loader');
      logger.task(`Client assets serving from ${clientCompiler.options.output.publicPath}`);
      isInitialClientCompile = false;
    }
    compileHotServer();
  });

  // Compile Server Webpack Config
  serverCompiler = webpackCompiler(serverConfig, () => {
    // The hot server will recompile and restart so we
    // need to make sure we only check the port once.
    if (isInitialServerCompile) {
      ifPortIsFreeDo(serverPort, startHotServer);
      isInitialServerCompile = false;
    } else startHotServer();
  });

  // Start client hot server
  ifPortIsFreeDo(clientPort, startClient);
};
