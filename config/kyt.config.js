
// Merges base and user kyt config

const path = require('path');
const shell = require('shelljs');
const baseConfig = require('./kyt.base.config');
const merge = require('ramda').merge;


const userConfigPath = path.join(process.env.USER_ROOT, './kyt.config.js');
let config;
const logger = console;

// Add base config option for productionPublicPath
baseConfig.productionPublicPath = '/public/assets/';
// Find user config
if (shell.test('-f', userConfigPath)) {
  try {
    config = require(userConfigPath); // eslint-disable-line global-require
  } catch (error) {
    logger.error('Error loading your kyt.config.js:', error);
    process.exit();
  }
}

config = merge(baseConfig, config);
// add userRootPath to Config
config.userRootPath = process.env.USER_ROOT;

// Create default modify function
if (typeof config.modifyWebpackConfig !== 'function') {
  config.modifyWebpackConfig = (webpackConfig) => webpackConfig;
}

// In case `reactHotLoader` is undefined, make it a boolean
config.reactHotLoader = !!config.reactHotLoader;

module.exports = config;
