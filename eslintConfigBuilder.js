
const path = require('path');
const fs = require('fs');
const merge = require('ramda').merge;
const baseConfig = require('./eslint.json');


module.exports = (configPath) => {
  const configFile = path.join(process.cwd(), configPath);

  if (fs.existsSync(configFile)) {
    // eslint-disable-next-line
    const customConfig = require(configFile);
    return merge(baseConfig, customConfig);
  }

  return baseConfig;
};
