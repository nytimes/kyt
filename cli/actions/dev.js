
// Command to run development server

const path = require('path');
const chokidar = require('chokidar');
const express = require('express');
const SingleChild = require('single-child');
const devMiddleware = require('webpack-dev-middleware');
const logger = require('./../logger');
const ifPortIsFreeDo = require('../../utils/ifPortIsFreeDo');
const buildConfigs = require('../../utils/buildConfigs');
const webpackCompiler = require('../../utils/webpackCompiler');
const WebpackDevServer = require('webpack-dev-server');

module.exports = () => {
  logger.start('Starting development build...');

  const {
    clientConfig,
    serverConfig,
    clientPort,
    serverPort,
    userRootPath,
  } = buildConfigs();

  let isInitialServerCompile = true;
  let isInitialClientCompile = true;
  let clientCompiler;
  let serverCompiler;
  let server = null;
  let webpackDevMiddleware;
  let clientServer;

  const startClient = () => {
    const devOptions = {
      publicPath: clientCompiler.options.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      noInfo: true,
      quiet: true,
      // watchOptions: {
      //   poll: false,
      // },

      lazy: true,
      filename: clientCompiler.options.output.filename,
    };
    const app = new WebpackDevServer(clientCompiler, devOptions);
    // const app = express();
    // webpackDevMiddleware = devMiddleware(clientCompiler, devOptions);
    // app.use(webpackDevMiddleware);

    app.listen(clientPort);
    clientServer = app;
  };

  const startServer = () => {
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

  const compileServer = () => {
    serverCompiler.run(() => {
      clientCompiler.run(() => undefined);
      //webpackDevMiddleware.invalidate();
      //clientServer.invalidate();
      //clientServer.sockWrite(clientServer.sockets, 'ok');
    });
  };

  const startWatcher = () => {
    // Watch the server files and recompile and restart on changes.
    const watcher = chokidar.watch([path.join(userRootPath, 'src')]);
    watcher.on('ready', () => {
      watcher
        .on('add', compileServer)
        .on('addDir', compileServer)
        .on('change', compileServer)
        .on('unlink', compileServer)
        .on('unlinkDir', compileServer);
    });
  };

  // Compile Client Webpack Config
  clientCompiler = webpackCompiler(clientConfig, () => {
    // if (isInitialClientCompile) {
    //   isInitialClientCompile = false;
    //   logger.task(`Client assets serving from ${clientCompiler.options.output.publicPath}`);
    // }
  });

  // Compile Server Webpack Config
  serverCompiler = webpackCompiler(serverConfig, () => {
    // The hot server will recompile and restart so we
    // need to make sure we only check the port once.
    if (isInitialServerCompile) {
      isInitialServerCompile = false;
      // ifPortIsFreeDo(serverPort, startServer);
      // startWatcher();
    } else {
      startServer();
    }
  });

  // Start client hot server
  ifPortIsFreeDo(clientPort, startClient);
  clientCompiler.run(() => {
    logger.task(`Client assets serving from ${clientCompiler.options.output.publicPath}`);
    serverCompiler.run(() => {
      ifPortIsFreeDo(serverPort, startServer);
      startWatcher();
    });
  });

  //compileServer();
};
