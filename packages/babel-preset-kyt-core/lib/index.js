const babelPresetLatest = require('babel-preset-latest');
const babelTransformRuntime = require('babel-plugin-transform-runtime');
const babelTransformModules = require('babel-plugin-transform-es2015-modules-commonjs');

module.exports = {
  // modules are handled by webpack, don't transform them
  presets: [[babelPresetLatest, { modules: false }]],

  // remove when https://github.com/NYTimes/kyt/pull/255 is merged
  plugins: [babelTransformRuntime],

  env: {
    test: {
      plugins: [
        [babelTransformModules, { loose: true }],
      ],
    },
  },
};
