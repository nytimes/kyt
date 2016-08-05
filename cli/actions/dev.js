
// Command to run development server

const shell = require('shelljs');
const path = require('path');
const chokidar = require('chokidar');
const webpack = require('webpack');
const express = require('express');
const logger = require('../logger');
const kytConfig = require('../../config/kyt.config.js');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const SingleChild = require('single-child');
let clientConfig = require('./../../config/webpack.dev.client');
let serverConfig = require('./../../config/webpack.dev.server');
const baseConfig = require('./../../config/webpack.base');
const merge = require('webpack-merge');

module.exports = (program) => {
  const args = program.args[0];
  const clientPort = kytConfig.clientPort;
  const serverPort = kytConfig.serverPort;
  const userRootPath = path.resolve(__dirname, '../../../../');

  const clientOptions = {
    configType: 'devClient',
    serverPort,
    clientPort,
    environment: 'development',
    publicPath: `http://localhost:${clientPort}/assets/`,
    assetsPath: path.join(userRootPath, 'build/client'),
    userRootPath,
  };

  const serverOptions = merge(clientOptions, {
    assetsPath: path.join(userRootPath, 'build/server'),
    configType: 'devServer'
  });

  let clientBundle = null;
  let clientCompiler = null;
  let server = null;
  let serverBundle = null;
  let serverCompiler = null;

  clientConfig = merge.smart(baseConfig(clientOptions), clientConfig(clientOptions));
  serverConfig = merge.smart(baseConfig(serverOptions), serverConfig(serverOptions));

    // modify configs
  clientConfig = kytConfig.modifyWebpackConfig(clientConfig, clientOptions);
  logger.task('modify client config');
  serverConfig = kytConfig.modifyWebpackConfig(serverConfig, serverOptions);
  logger.task('modify server config');

  logger.start('Starting development build...');

  const startHotServer = () => {
    const serverPath = path.resolve(
      serverCompiler.options.output.path, `${Object.keys(serverCompiler.options.entry)[0]}.js`
    );

    try {
      if (server) {
        server.restart();
        logger.task('Development server restarted')
      } else {
        server = new SingleChild('node', [serverPath], {
          stdio: [0, 1, 2],
        });
        server.start();

        logger.task(`Server running at: ${'http://localhost:' + serverPort}`);
        logger.end('Development started');
      }
    } catch (error) {
      logger.error('Client bundle is invalid\n', error);
    }
  }

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

    logger.task(`Client server running at: ${clientCompiler.options.output.publicPath}`);
  }

  try {
    logger.debug('Client webpack configuration:', clientConfig);
    clientCompiler = webpack(clientConfig);
  } catch (error) {
    logger.error('❌  Client webpack config is invalid\n', error)
    process.exit()
  }

  try {
    logger.debug('Server webpack configuration:', serverConfig);
    serverCompiler = webpack(serverConfig);
  } catch (error) {
    logger.error('Server webpack config is invalid\n', error)
    process.exit()
  }

  clientCompiler.plugin('done', (stats) => {
    if (stats.hasErrors()) {
      logger.error('Client build failed\n', stats.toString());
    } else {
      logger.task('Client build successful');
    }
  });

  startHotClient();

  const compileHotServer = () => {
    serverCompiler.run(() => undefined);
  };

  clientCompiler.plugin('done', (stats) => {
    if (!stats.hasErrors()) compileHotServer();
  });

  serverCompiler.plugin('done', (stats) => {
    if (stats.hasErrors()) {
      logger.error('Server compiler failed\n', stats.toString());
    } else {
      logger.task('Server compiled');
      startHotServer();
    }
  });

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
};
