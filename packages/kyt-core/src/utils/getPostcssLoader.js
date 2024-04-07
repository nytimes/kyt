const fs = require('fs');
const { userPostcssConfigPath } = require('kyt-utils/paths')();
const logger = require('kyt-utils/logger');
const kytPostcssConfig = require('../config/postcss.config');

// We either use the kyt postcss.config.js or we use an
// override from the user.
const postcssConfig = { loader: 'postcss-loader' };
const userHasPostcssConfig = fs.existsSync(userPostcssConfigPath);

if (userHasPostcssConfig) {
  logger.info(`Using postcss config: ${userPostcssConfigPath}`);
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const userPostcssConfig = require(userPostcssConfigPath);
  postcssConfig.options =
    typeof userPostcssConfig === 'function' ? userPostcssConfig() : userPostcssConfig;
} else {
  postcssConfig.options = kytPostcssConfig;
}

module.exports = postcssConfig;