/* eslint-disable no-console */
// Merges base and user kyt config

const path = require('path');
const shell = require('shelljs');
const mergeAll = require('ramda').mergeAll;
const { userRootPath, userKytConfigPath } = require('./paths')();

module.exports = optionalConfig => {
  let config;

  // base config options
  const baseConfig = {
    productionPublicPath: '/assets/',
    clientPort: 3001,
    serverPort: 3000,
    prototypePort: 3002,
    debug: false,
    reactHotLoader: false,
  };

  const kytConfigPath = optionalConfig
    ? path.join(userRootPath, optionalConfig)
    : userKytConfigPath;

  // Find user config
  if (shell.test('-f', kytConfigPath)) {
    try {
      console.info(`Using kyt config at ${kytConfigPath}`);
      config = require(kytConfigPath); // eslint-disable-line global-require
    } catch (error) {
      console.error('Error loading your kyt.config.js:', error);
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

  return Object.freeze(config);
};
