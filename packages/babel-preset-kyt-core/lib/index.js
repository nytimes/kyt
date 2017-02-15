var babelPresetLatest = require('babel-preset-latest');
var babelTransformRuntime = require('babel-plugin-transform-runtime');
var babelTransformModules = require('babel-plugin-transform-es2015-modules-commonjs');
var babelSyntaxDynamicImport = require('babel-plugin-syntax-dynamic-import');
var babelEslint = require('babel-eslint');

module.exports = function getPresetCore(context, opts) {
  opts = opts || {};
  return {
    parser: babelEslint,
    parserOptions: {
      sourceType: 'module',
      allowImportExportEverywhere: true,
    },

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
