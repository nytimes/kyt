const babelJest = require('babel-jest');
const fs = require('fs');
const shell = require('shelljs');
const { userBabelrcPath, userRootPath } = require('kyt-utils/paths')();
const resolve = require('resolve');

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
      resolved = resolve.sync(`${prefix}-${dep}`, { basedir: userRootPath });
    } catch (e) { /* eslint-disable no-empty */ }
  }

  return resolved || resolve.sync(dep, { basedir: userRootPath });
};

// Uses require.resolve to add the full paths to all of the plugins
// and presets, making sure that we handle the new array syntax.
const resolvePluginsPresets = (babelGroup) => {
  const resolver = (prefix, dep) => {
    if (typeof dep === 'object') {
      dep[0] = normalizeDep(prefix, dep[0]);
      return dep;
    }
    return normalizeDep(prefix, dep);
  };
  babelGroup.plugins = (babelGroup.plugins || []).map(resolver.bind(null, 'babel-plugin'));
  babelGroup.presets = (babelGroup.presets || []).map(resolver.bind(null, 'babel-preset'));
};

let babelrc;

if (shell.test('-f', userBabelrcPath)) {
  babelrc = JSON.parse(fs.readFileSync(userBabelrcPath));
  resolvePluginsPresets(babelrc);
  Object.keys(babelrc.env || {}).forEach(env => resolvePluginsPresets(babelrc.env[env]));
} else {
  // if the user hasn't defined a .babelrc, use the kyt default preset
  babelrc = {
    presets: [require.resolve('babel-preset-kyt-core')],
  };
}

module.exports = babelJest.createTransformer(babelrc);
