
// Compiles the {server, client} configurations
// For use by the client and server compilers.

const merge = require('webpack-merge');
const logger = require('../cli/logger');
const clone = require('ramda').clone;
// base configs
const baseConfig = require('../config/webpack.base');
// dev configs
const devClientConfig = require('../config/webpack.dev.client');
const devServerConfig = require('../config/webpack.dev.server');
// prod configs
const prodClientConfig = require('../config/webpack.prod.client');
const prodServerConfig = require('../config/webpack.prod.server');

module.exports = (config, environment = 'development') => {
  const { clientURL, serverURL, reactHotLoader } = config;

  let clientConfig = devClientConfig;
  let serverConfig = devServerConfig;

  let clientOptions = {
    type: 'client',
    serverURL,
    clientURL,
    environment,
    publicPath: `${clientURL.href}assets/`,
    publicDir: 'src/public',
    clientAssetsFile: 'publicAssets.json',
    reactHotLoader,
  };

  // These are the only differences between dev & prod
  if (environment === 'production') {
    clientConfig = prodClientConfig;
    serverConfig = prodServerConfig;
    clientOptions = merge(clientOptions, {
      publicPath: config.productionPublicPath,
      publicDir: 'build/public',
    });
  }

  const serverOptions = merge(clientOptions, { type: 'server' });

  // Merge options with static webpack configs
  clientConfig = merge.smart(baseConfig(clientOptions), clientConfig(clientOptions));
  serverConfig = merge.smart(baseConfig(serverOptions), serverConfig(serverOptions));

  // Modify via userland webpack config
  try {
    clientConfig = config.modifyWebpackConfig(clone(clientConfig), clientOptions);
    serverConfig = config.modifyWebpackConfig(clone(serverConfig), serverOptions);
  } catch (error) {
    logger.error('Error in your kyt.config.js modifyWebpackConfig():', error);
    process.exit(1);
  }

  // Merge in userland babel config via `config.transformBabelConfig`
  try {
    [
      { webpackConfig: clientConfig, options: clientOptions },
      { webpackConfig: serverConfig, options: serverOptions },
    ].forEach(({ webpackConfig, options }) => {
      const babelLoader = webpackConfig.module.loaders.find(({ loader }) => loader === 'babel-loader');
      Object.assign(babelLoader, {
        query: config.modifyBabelConfig(clone(babelLoader.query), options),
      });
    });
  } catch (error) {
    logger.error('Error in your kyt.config.js modifyBabelConfig():', error);
    process.exit(1);
  }

  if (config.debug) {
    logger.debug('Client webpack configuration:', clientConfig);
    logger.debug('\n\n');
    logger.debug('Server webpack configuration:', serverConfig);
  }

  return {
    clientConfig,
    serverConfig,
  };
};
