
const shell = require('shelljs');
const path = require('path');
const chokidar = require('chokidar');
const webpack = require('webpack');
const express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const SingleChild = require('single-child');
let clientConfig = require('./../../config/webpack.dev.client');
let serverConfig = require('./../../config/webpack.dev.server');
const baseConfig = require('./../../config/webpack.base');
const merge = require('webpack-merge');

module.exports = (program) => {
  const args = program.args[0];
  const clientPort = 3001;
  const serverPort = args.port ? args.port : 3000;
  const basePath = path.resolve(__dirname, '../../../../');

  const verboseOutput = (...input) => {
    var logs = input.reduce((memo, log) => {
      if (typeof log === 'object') memo.push(JSON.stringify(log, null, '  '));
      else memo.push(log);
      return memo;
    }, []);
    if (args.verbose) {
      console.log.apply(null, logs);
    }
  };

  const clientOptions = {
    serverPort,
    clientPort,
    environment: 'development',
    configPath: args.config,
    publicPath: `http://localhost:${clientPort}/assets/`,
    assetsPath: path.join(basePath, 'build/client'),
    basePath,
  };

  const serverOptions = merge(clientOptions, {
    assetsPath: path.join(basePath, 'build/server'),
  });

  let clientBundle = null;
  let clientCompiler = null;
  let server = null;
  let serverBundle = null;
  let serverCompiler = null;

  clientConfig = merge.smart(baseConfig(clientOptions), clientConfig(clientOptions));
  serverConfig = merge.smart(baseConfig(serverOptions), serverConfig(serverOptions));

  console.log('🔥  Starting development build...');

  const startHotServer = () => {
    const serverPath = path.resolve(
      serverCompiler.options.output.path, `${Object.keys(serverCompiler.options.entry)[0]}.js`
    );

    try {
      if (server) {
        server.restart();
        console.log('✅  Development server restarted')
      } else {
        server = new SingleChild('node', [serverPath], {
          stdio: [0, 1, 2],
        });
        server.start();

        console.log(`ℹ️  Server running at: ${'http://localhost:' + serverPort}`);
        console.log('✅  Development started');
      }
    } catch (error) {
      console.log('❌  Client bundle is invalid\n', error);
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

    console.log(`ℹ️  Client server running at: ${clientCompiler.options.output.publicPath}`);
  }

  try {
    verboseOutput('ℹ️  Client webpack configuration:', clientConfig);
    clientCompiler = webpack(clientConfig);
  } catch (error) {
    console.log('❌  Client webpack config is invalid\n', error)
    process.exit()
  }

  try {
    verboseOutput('ℹ️  Server webpack configuration:', serverConfig);
    serverCompiler = webpack(serverConfig);
  } catch (error) {
    console.log('❌  Server webpack config is invalid\n', error)
    process.exit()
  }

  clientCompiler.plugin('done', (stats) => {
    if (stats.hasErrors()) {
      console.log('❌  Client build failed\n', stats.toString());
    } else {
      console.log('ℹ️  Client build successful');
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
      console.log('❌  Server compiler failed\n', stats.toString());
    } else {
      console.log('ℹ️  Server compiled');
      startHotServer();
    }
  });

  // Watch the server files and recompile and restart on changes.
  const watcher = chokidar.watch([path.join(basePath, 'src/server')]);
  watcher.on('ready', () => {
    watcher
      .on('add', compileHotServer)
      .on('addDir', compileHotServer)
      .on('change', compileHotServer)
      .on('unlink', compileHotServer)
      .on('unlinkDir', compileHotServer);
  });
};
