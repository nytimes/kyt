
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./config/webpack.base.config.js');
const devConfig = require('./config/webpack.dev.config.js');
const prodConfig = require('./config/webpack.prod.config.js');
let envConfig, config;

/*
 * The Config builder tool takes the magic starter
 * base config and does a smart merge with any custom
 * config specified by the user.
 * It also adds the hot module plugin for the dev server
 * (Todo: move this when we create a dev vs prd option)
 *
*/
module.exports = (configPath, options) => {

  if (options.environment === 'development') {
    envConfig = devConfig;
  } else if (options.environment === 'production') {
    envConfig = prodConfig;
  }

  config = merge.smart(baseConfig(options), envConfig(options));

  if (configPath) {
    var configFile = path.join(process.cwd(), configPath);

    if (fs.existsSync(configFile)) {
      let customConfig = require(configFile);
      // Support function or object configurations.
      // The former lets us pass in the options.
      if (typeof customConfig === 'function') {
        customConfig = customConfig(options);
      }
      return merge.smart(config, customConfig);
    }
  }

  return config;
}
