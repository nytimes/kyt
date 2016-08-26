
// Compiles the {server, client} configurations
// For use by the client and server compilers.

const path = require('path');
const merge = require('webpack-merge');
const logger = require('../cli/logger');
const clone = require('ramda').clone;
// base configs
const kytConfigFn = require('./kytConfig');
const baseConfig = require('../config/webpack.base');
// dev configs
const devClientConfig = require('../config/webpack.dev.client');
const devServerConfig = require('../config/webpack.dev.server');
// prod configs
const prodClientConfig = require('../config/webpack.prod.client');
const prodServerConfig = require('../config/webpack.prod.server');

module.exports = (environment = 'development') => {
  const kytConfig = kytConfigFn();
  const { clientPort, serverPort, userRootPath, reactHotLoader } = kytConfig;
  const buildPath = path.join(userRootPath, 'build');

  let clientConfig = devClientConfig;
  let serverConfig = devServerConfig;

  const clientOptions = {
    type: 'client',
    serverPort,
    clientPort,
    environment,
    buildPath,
    publicPath: `http://localhost:${clientPort}/assets/`,
    publicDir: path.join(userRootPath, 'src/public'),
    clientAssetsFile: 'publicAssets.json',
    userRootPath,
    reactHotLoader,
  };

  // These are the only differences between dev & prod
  if (environment === 'production') {
    clientConfig = prodClientConfig;
    serverConfig = prodServerConfig;
    clientOptions.clientPort = undefined;
    clientOptions.publicPath = kytConfig.productionPublicPath;
    clientOptions.publicDir = path.join(buildPath, 'public');
  }

  const serverOptions = merge(clientOptions, {
    type: 'server',
  });

  // Merge options with static webpack configs
  clientConfig = merge.smart(baseConfig(clientOptions), clientConfig(clientOptions));
  serverConfig = merge.smart(baseConfig(serverOptions), serverConfig(serverOptions));

  // Modify via userland config
  try {
    clientConfig = kytConfig.modifyWebpackConfig(clone(clientConfig), clientOptions);
    serverConfig = kytConfig.modifyWebpackConfig(clone(serverConfig), serverOptions);
  } catch (error) {
    logger.error('Error in your kyt.config.js modifyWebpackConfig():', error);
    process.exit(1);
  }

  return {
    clientConfig,
    serverConfig,
    clientPort, // TODO: Should these really be here?
    serverPort,
    userRootPath,
    reactHotLoader,
  };
};
