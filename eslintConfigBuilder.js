
const path = require('path');
const fs = require('fs');
const merge = require('ramda').merge;
const baseConfig = require('./eslint.json');


module.exports = (configPath) => {
  var configFile = path.join(process.cwd(), configPath);

  if (fs.existsSync(configFile)) {
    const customConfig = require(configFile);
    return merge(baseConfig, customConfig);
  }

  return baseConfig;
}
