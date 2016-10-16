const path = require('path');
const fs = require('fs');
const getKytConfig = require('../utils/kytConfig');
const logger = require('../cli/logger');

// Uses require.resolve to add the full paths to all of the plugins
// and presets, making sure that we handle the new array syntax.
const resolvePluginsPresets = (babelGroup) => {
  const resolve = (dep) => {
    if (typeof dep === 'object') {
      dep[0] = require.resolve(dep[0]);
      return dep;
    }
    return require.resolve(dep);
  };
  babelGroup.plugins = (babelGroup.plugins || []).map(resolve);
  babelGroup.presets = (babelGroup.presets || []).map(resolve);
};

module.exports = (options) => {
  const config = getKytConfig();

  // Create the babelrc query for the babel loader.
  const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.babelrc'), 'utf8'));
  babelrc.babelrc = false;
  babelrc.cacheDirectory = false;
  resolvePluginsPresets(babelrc);
  if (options && options.reactHotLoader) {
    babelrc.env.development.plugins.push('react-hot-loader/babel');
  }
  Object.keys(babelrc.env || {}).forEach(env => resolvePluginsPresets(babelrc.env[env]));

  try {
    // modify via userland kytConfig's `modifyBabelConfig`
    const modifiedBabelrc = config.modifyBabelConfig(babelrc, options);
    if (config.debug) {
      logger.debug('Modified babel configuration:', modifiedBabelrc);
    }
    return modifiedBabelrc;
  } catch (error) {
    logger.error('Error in your kyt.config.js modifyBabelConfig():', error);
    // return to satisfy eslint `consistent-return` rule
    return process.exit(1);
  }
};
