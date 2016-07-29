"use strict";
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./config/webpack.base.config.js');
const devConfig = require('./config/webpack.dev.config.js');
const prodConfig = require('./config/webpack.prod.config.js');
const protoConfig = require('./config/webpack.proto.config.js');
let envConfig;
let config;

const getOptions = (options) => {
  return options || JSON.parse(process.env.KYT_OPTIONS);
};

// The Config builder tool takes the magic starter base config
// and does a smart merge with any custom config specified by the user.
//
// Returns `options` with a `webpackConfig` and `webpackCompiler`.
//
module.exports = (opts) => {

  const options = getOptions(opts);

  if (options.environment === 'development') {
    envConfig = devConfig;
  } else if (options.environment === 'production') {
    envConfig = prodConfig;
  } else if (options.environment === 'proto') {
    envConfig = protoConfig;
  }

  config = merge.smart(baseConfig(options), envConfig(options));

  if (options.configPath) {
    const configFile = path.join(process.cwd(), options.configPath);

    if (fs.existsSync(configFile)) {
      // eslint-disable-next-line
      let customConfig = require(configFile);

      // Support function or object configurations.
      // The former lets us pass in the options.
      if (typeof customConfig === 'function')
        customConfig = customConfig(options);

      options.webpackConfig = merge.smart(config, customConfig);
    }
  } else {
    options.webpackConfig = config;
  }

  if (options.printConfig) console.dir(config, { depth: 8 });

  options.webpackCompiler = webpack(options.webpackConfig);

  return options;
};
