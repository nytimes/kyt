
// Merges base and user kyt config

const path = require('path');
const shell = require('shelljs');
const mergeAll = require('ramda').mergeAll;
const { userRootPath, userKytConfigPath } = require('./paths')();

module.exports = (optionalConfig) => {
  if (global.config) return;

  // base config options
  const baseConfig = {
    productionPublicPath: '/assets/',
    clientPort: 3001,
    serverPort: 3000,
    prototypePort: 3002,
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

  // Create default identity functions for modify functions
  ['modifyWebpackConfig', 'modifyJestConfig'].forEach(m => {
    if (typeof config[m] !== 'function') {
      config[m] = c => c;
    }
  });

  global.config = Object.freeze(config);
};
