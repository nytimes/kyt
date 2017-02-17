var babelPresetLatest = require('babel-preset-latest');
var babelTransformRuntime = require('babel-plugin-transform-runtime');
var babelTransformModules = require('babel-plugin-transform-es2015-modules-commonjs');
var babelSyntaxDynamicImport = require('babel-plugin-syntax-dynamic-import');

module.exports = function getPresetCore(context, opts) {
  opts = opts || {};
  return {
    // modules are handled by webpack, don't transform them
    presets: [[babelPresetLatest, { modules: false }]],

    // provide the ability to opt into babel-plugin-transform-runtime inclusion
    plugins: [
      opts.includeRuntime === true && babelTransformRuntime,
      babelSyntaxDynamicImport,
    ].filter(Boolean),

    env: {
      test: {
        plugins: [
          [babelTransformModules, { loose: true }],
        ],
      },
    },
  };
};
