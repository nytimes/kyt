const shell = require('shelljs');
const { userPostcssConfigPath } = require('kyt-utils/paths')();
const kytPostcssConfig = require('../config/postcss.config');

// We either use the kyt postcss.config.js or we use an
// override from the user.
const postcssConfig = { loader: 'postcss-loader' };
const userHasPostcssConfig = shell.test('-f', userPostcssConfigPath).code === 0;

if (userHasPostcssConfig) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const userPostcssConfig = require(userPostcssConfigPath);
  postcssConfig.options = typeof userPostcssConfig === 'function'
    ? userPostcssConfig()
    : userPostcssConfig;
} else {
  postcssConfig.options = kytPostcssConfig;
}

module.exports = postcssConfig;
