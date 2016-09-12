
// Merges base and user kyt config

const path = require('path');
const shell = require('shelljs');
const mergeAll = require('ramda').mergeAll;
const { userRootPath, userKytConfigPath } = require('./paths')();
const url = require('url');

module.exports = (optionalConfig) => {
  if (global.config) return;

  // base config options
  const baseConfig = {
    productionPublicPath: '/assets/',
    serverURL: 'http://localhost:3000',
    clientURL: 'http://localhost:3001',
    prototypeURL: 'http://localhost:3002',
    debug: false,
    reactHotLoader: false,
  };

  const userConfigPath = optionalConfig
    ? path.join(userRootPath, optionalConfig)
    : userKytConfigPath;
  let config;
  const logger = console;

  // Find user config
  if (shell.test('-f', userConfigPath)) {
    try {
      logger.info(`Using kyt config at ${userConfigPath}`);
      config = require(userConfigPath); // eslint-disable-line global-require
    } catch (error) {
      logger.error('Error loading your kyt.config.js:', error);
      process.exit();
    }
  }

  config = mergeAll([{}, baseConfig, config]);

  // Create default modify function
  if (typeof config.modifyWebpackConfig !== 'function') {
    config.modifyWebpackConfig = (webpackConfig) => webpackConfig;
  }

  // Convert the URL strings into objects
  // to make them easier to work with.
  config.serverURL = url.parse(config.serverURL);
  config.clientURL = url.parse(config.clientURL);
  config.prototypeURL = url.parse(config.prototypeURL);

  global.config = Object.freeze(config);
};
