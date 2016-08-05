
// Merges base and user kyt config

const shell = require('shelljs');
const path = require('path');
const userConfig = path.resolve(__dirname,'../../../kyt.config.js');
const baseConfig = require('./kyt.base.config.js');
let config;

// Find user config
if (shell.test('-f', userConfig)) {
  config = require(userConfig);
} else {
  config = baseConfig;
}

// Create default modify function
if (typeof(config.modifyWebpackConfig) !== 'function') {

  config.modifyWebpackConfig = (webpackConfig, options) => {
   return webpackConfig;
  };
}

module.exports = config;
