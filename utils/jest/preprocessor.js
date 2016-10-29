const babelJest = require('babel-jest');
const fs = require('fs');
const { userBabelrcPath, userRootPath } = require('../paths')();
const resolve = require('resolve');

const resolvePluginsPresets = (babelGroup) => {
  const resolver = (dep) => {
    if (typeof dep === 'object') {
      dep[0] = resolve.sync(dep[0], { basedir: userRootPath });
      return dep;
    }
    return resolve.sync(dep, { basedir: userRootPath });
  };
  babelGroup.plugins = (babelGroup.plugins || []).map(resolver);
  babelGroup.presets = (babelGroup.presets || []).map(resolver);
};

const userBabelrc = JSON.parse(fs.readFileSync(userBabelrcPath));

resolvePluginsPresets(userBabelrc);
Object.keys(userBabelrc.env || {}).forEach(env => resolvePluginsPresets(userBabelrc.env[env]));

module.exports = babelJest.createTransformer(userBabelrc);
