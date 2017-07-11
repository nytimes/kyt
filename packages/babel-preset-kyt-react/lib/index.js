var babelPresetReact = require('babel-preset-react');
var reactRemovePropTypes = require('babel-plugin-transform-react-remove-prop-types');
var reactTransformConstant = require('babel-plugin-transform-react-constant-elements');
var reactTransformInline = require('babel-plugin-transform-react-inline-elements');
var reactTransformJsxSource = require('babel-plugin-transform-react-jsx-source');
var babelPresetKytCore = require('babel-preset-kyt-core');

module.exports = function getPresetReact(context, opts) {
  opts = opts || {};
  return {
    presets: [
      babelPresetReact,
      // pass options through to core preset
      [babelPresetKytCore, opts.coreOptions || {}],
    ],
    env: {
      development: {
        plugins: [reactTransformJsxSource],
      },
      production: {
        plugins: [reactRemovePropTypes, reactTransformConstant, reactTransformInline],
      },
    },
  };
};
