
const fs = require('fs');
const chalk = require('chalk');
const logger = console;
const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const clientWebpackConfig = require('./../../config/webpack.prod.client');
const serverWebpackConfig = require('./../../config/webpack.prod.server');
const baseConfig = require('./../../config/webpack.base');
const merge = require('webpack-merge');

module.exports = (program) => {
  // Comment the following if you want
  // to see the verbose command ouput.
  // shell.config.silent = true;
  const args = program.args[0];
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
    clientPort: undefined,
    environment: 'production',
    configPath: args.config,
    publicPath: '/assets/',
    assetsPath: path.join(basePath, 'build/client'),
    basePath,
  };

  const serverOptions = merge(clientOptions, {
    assetsPath: path.join(basePath, 'build/server'),
  });

  let clientCompiler = null;
  let serverCompiler = null;

  const clientConfig = merge.smart(baseConfig(clientOptions), clientWebpackConfig(clientOptions));
  const serverConfig = merge.smart(baseConfig(serverOptions), serverWebpackConfig(serverOptions));

  console.log('🔥  Starting production build...');

  // Clean the build directory.
  if (shell.exec(`rm -rf ${basePath}/build`).code === 0) {
    console.log('ℹ️  Cleaned ./build');
  }

  const buildServer = () => {
    try {
      verboseOutput('ℹ️  Server webpack configuration:', serverConfig);
      serverCompiler = webpack(serverConfig);
      console.log('ℹ️  Server webpack configuration compiled');
    } catch (error) {
      console.log('❌  Server webpack configuration is invalid\n', error)
      process.exit();
    }

    serverCompiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        console.log('❌  Server build failed\n', stats.toString());
      } else {
        console.log('ℹ️  Server build successful');
        console.log('✅  Done building');
      }
    });

    serverCompiler.run(() => undefined);
  };

  try {
    verboseOutput('ℹ️  Client webpack configuration:', clientConfig);
    clientCompiler = webpack(clientConfig);
    console.log('ℹ️  Client webpack configuration compiled');
  } catch (error) {
    console.log('❌  Client webpack configuration is invalid\n', error)
    process.exit();
  }

  clientCompiler.plugin('done', (stats) => {
    if (stats.hasErrors()) {
      console.log('❌  Client build failed\n', stats.toString());
    } else {
      console.log('ℹ️  Client build successful');
      buildServer();
    }
  });

  clientCompiler.run(() => undefined);
};
