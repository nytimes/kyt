
// Command to build production code

const fs = require('fs');
const chalk = require('chalk');
const logger = require('./../logger');
const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const kytConfig = require('./../../config/kyt.config.js');
const clientWebpackConfig = require('./../../config/webpack.prod.client');
const serverWebpackConfig = require('./../../config/webpack.prod.server');
const baseConfig = require('./../../config/webpack.base');
const merge = require('webpack-merge');
const filesize = require('filesize');
const stripAnsi = require('strip-ansi');

module.exports = (program) => {
  const args = program.args[0];
  const serverPort = kytConfig.serverPort;
  const userRootPath = process.cwd();

  const clientOptions = {
    configType: 'buildClient',
    serverPort,
    clientPort: undefined,
    environment: 'production',
    publicPath: kytConfig.productionPublicPath,
    assetsPath: path.join(userRootPath, 'build/client'),
    userRootPath,
  };

  const serverOptions = merge(clientOptions, {
    assetsPath: path.join(userRootPath, 'build/server'),
    configType: 'buildServer'
  });

  let clientCompiler = null;
  let serverCompiler = null;

  let clientConfig = merge.smart(baseConfig(clientOptions), clientWebpackConfig(clientOptions));
  let serverConfig = merge.smart(baseConfig(serverOptions), serverWebpackConfig(serverOptions));

  // Modify configs
  clientConfig = kytConfig.modifyWebpackConfig(clientConfig, clientOptions);
  serverConfig = kytConfig.modifyWebpackConfig(serverConfig, serverOptions);

  logger.start('Starting production build...');

  // Clean the build directory.
  if (shell.exec(`rm -rf ${userRootPath}/build`).code === 0) {
    logger.task('Cleaned ./build');
  }

  const buildServer = () => {
    try {
      logger.debug('Server webpack configuration:', serverConfig);
      serverCompiler = webpack(serverConfig);
      logger.task('Server webpack configuration compiled');
    } catch (error) {
      logger.error('Server webpack configuration is invalid\n', error)
      process.exit();
    }

    serverCompiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        logger.error('Server build failed\n', stats);
      } else {
        logger.task('Server build successful');
        logger.end('Done building');
      }
    });

    serverCompiler.run(() => undefined);
  };

  try {
    logger.debug('Client webpack configuration:', clientConfig);
    clientCompiler = webpack(clientConfig);
    logger.task('Client webpack configuration compiled');
  } catch (error) {
    logger.error('Client webpack configuration is invalid\n', error)
    process.exit();
  }

  const printAssets = (stats) => {
    const assets = stats.toJson().assets
      .filter(asset => /\.(js|css)$/.test(asset.name))
      .map(asset => {
        return {
          folder: path.join('build/client', path.dirname(asset.name)),
          name: path.basename(asset.name),
          size: asset.size,
          sizeLabel: filesize(asset.size)
        };
      });
    assets.sort((a, b) => b.size - a.size);
    const longestSizeLabelLength = Math.max.apply(null,
      assets.map(a => stripAnsi(a.sizeLabel).length)
    );
    assets.forEach(asset => {
      let sizeLabel = asset.sizeLabel;
      const sizeLength = stripAnsi(sizeLabel).length;
      if (sizeLength < longestSizeLabelLength) {
        const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
        sizeLabel += rightPadding;
      }
      logger.log('    ' + sizeLabel + '    ' + asset.folder + path.sep + asset.name);
    });
  }

  clientCompiler.plugin('done', (stats) => {
    if (stats.hasErrors()) {
      logger.error('Client build failed\n', stats.toString());
    } else {
      logger.task('Client build successful');
      logger.info('Assets:');
      printAssets(stats);
      buildServer();
    }
  });

  clientCompiler.run(() => undefined);
};
