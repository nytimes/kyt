
// Merges base and user kyt config

const shell = require('shelljs');
const path = require('path');
const baseConfig = require('./kyt.base.config');

const userConfig = path.resolve(__dirname, '../../../kyt.config.js');
let config;

// Find user config
if (shell.test('-f', userConfig)) {
  config = require(userConfig); // eslint-disable-line global-require
} else {
  config = baseConfig;
}

// Create default modify function
if (typeof config.modifyWebpackConfig !== 'function') {
  config.modifyWebpackConfig = (webpackConfig) => webpackConfig;
}

module.exports = config;
