const path = require('path');
const fs = require('fs');

/**
 * Support preset and plugin definitions in .babelrc
 * without the babel-* prefixes.
 *
 * E.g. {presets: ['babel-preset-react']} --> {presets: ['react']}
 *
 * @param  {String} prefix One of either 'babel-plugin' or 'babel-preset'
 * @param  {String} dep    The dependency
 * @return {String}        The normalized dependency
 */
const normalizeDep = (prefix, dep) => {
  let resolved;
  if (dep.indexOf('babel') !== 0) {
    try {
      resolved = require.resolve(`${prefix}-${dep}`);
    } catch (e) { /* eslint-disable no-empty */ }
  }

  return resolved || require.resolve(dep);
};

// Uses require.resolve to add the full paths to all of the plugins
// and presets, making sure that we handle the new array syntax.
const resolvePluginsPresets = (babelGroup) => {
  const resolve = (prefix, dep) => {
    if (typeof dep === 'object') {
      dep[0] = normalizeDep(prefix, dep[0]);
      return dep;
    }
    return normalizeDep(prefix, dep);
  };
  babelGroup.plugins = (babelGroup.plugins || []).map(resolve.bind(null, 'babel-plugin'));
  babelGroup.presets = (babelGroup.presets || []).map(resolve.bind(null, 'babel-preset'));
};

module.exports = (options) => {
  // Create the babelrc query for the babel loader.
  const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.babelrc'), 'utf8'));
  babelrc.babelrc = false;
  babelrc.cacheDirectory = false;
  resolvePluginsPresets(babelrc);
  if (options && options.reactHotLoader) {
    babelrc.env.development.plugins.push('react-hot-loader/babel');
  }
  Object.keys(babelrc.env || {}).forEach(env => resolvePluginsPresets(babelrc.env[env]));

  return babelrc;
};
