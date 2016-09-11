
// Merges base and user kyt config

const path = require('path');
const shell = require('shelljs');
const mergeAll = require('ramda').mergeAll;
const { userRootPath, userKytConfigPath } = require('./paths')();

// let config;

module.exports = optionalConfig => {
  // if (config) return config;
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

  // Create default modify function
  if (typeof config.modifyWebpackConfig !== 'function') {
    config.modifyWebpackConfig = webpackConfig => webpackConfig;
  }

  config = Object.freeze(config);

  return config;
};
