
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./config/webpack.config.js');

/*
 * The Config builder tool takes the magic starter
 * base config and does a smart merge with any custom
 * config specified by the user.
 * It also adds the hot module plugin for the dev server
 * (Todo: move this when we create a dev vs prd option)
 *
*/
module.exports = (configPath, port) => {
  console.log(baseConfig)
  if (configPath) {
    var configFile = path.join(process.cwd(), configPath);

    if (fs.existsSync(configFile)) {
      const customConfig = require(configFile);
      return merge.smart(baseConfig(port), customConfig, {
        plugins: [
          new webpack.HotModuleReplacementPlugin()
        ]
      });
    }
  }

  return baseConfig(port);
}
