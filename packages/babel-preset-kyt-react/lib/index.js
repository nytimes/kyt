var babelPresetReact = require('babel-preset-react');
var reactRemovePropTypes = require('babel-plugin-transform-react-remove-prop-types');
var reactTransformConstant = require('babel-plugin-transform-react-constant-elements');
var reactTransformInline = require('babel-plugin-transform-react-inline-elements');
var reactTransformJsxSource = require('babel-plugin-transform-react-jsx-source');

// TODO add to package.json and use an absolute require once it's published
var babelPresetKytCore = require('../../babel-preset-kyt-core');

module.exports = (context, opts = {}) => ({
  presets: [
    babelPresetReact,
    // pass options through to core preset
    [babelPresetKytCore, opts.coreOptions || {}],
  ],
  env: {
    development: {
      plugins: [
        reactTransformJsxSource,
      ],
    },
    production: {
      plugins: [
        reactRemovePropTypes,
        reactTransformConstant,
        reactTransformInline,
      ],
    },
  },
});
