const babelJest = require('babel-jest');
const findBabelConfigSync = require('find-babel-config').sync;
const { userRootPath } = require('kyt-utils/paths')();

let babelrc = findBabelConfigSync(userRootPath);
if (babelrc) {
  babelrc = babelrc.config;
}

if (!babelrc) {
  // if the user hasn't defined a .babelrc, use the kyt default preset
  babelrc = {
    presets: [require.resolve('babel-preset-kyt-core')],
  };
}

module.exports = babelJest.createTransformer(babelrc);
