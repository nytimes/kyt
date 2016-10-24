const babelJest = require('babel-jest');
const fs = require('fs');
const path = require('path');
const { userBabelrcPath, userNodeModulesPath } = require('../paths')();

const resolvePluginsPresets = (babelGroup) => {
  // TODO this is overly limiting--what if it's a custom plugin versioned with
  // app code? need a better solution to read in the entirety of a user's .babelrc
  const resolveFromUserNodeModules = dep => path.resolve(userNodeModulesPath, dep);

  const resolve = (dep) => {
    if (typeof dep === 'object') {
      dep[0] = resolveFromUserNodeModules(dep[0]);
      return dep;
    }
    return resolveFromUserNodeModules(dep);
  };
  babelGroup.plugins = (babelGroup.plugins || []).map(resolve);
  babelGroup.presets = (babelGroup.presets || []).map(resolve);
};

const userBabelrc = JSON.parse(fs.readFileSync(userBabelrcPath));

resolvePluginsPresets(userBabelrc);
Object.keys(userBabelrc.env || {}).forEach(env => resolvePluginsPresets(userBabelrc.env[env]));

module.exports = babelJest.createTransformer(userBabelrc);
