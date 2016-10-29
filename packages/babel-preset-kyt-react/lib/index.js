const babelPresetReact = require('babel-preset-react');
const reactRemovePropTypes = require('babel-plugin-transform-react-remove-prop-types');
const reactTransformConstant = require('babel-plugin-transform-react-constant-elements');
const reactTransformInline = require('babel-plugin-transform-react-inline-elements');

// TODO add to package.json and use an absolute require once it's published
const babelPresetKytCore = require('../../babel-preset-kyt-core');

module.exports = (context, opts = {}) => ({
  presets: [
    babelPresetReact,
    // pass options through to core preset
    [babelPresetKytCore, opts.coreOptions || {}],
  ],
  env: {
    production: {
      plugins: [
        reactRemovePropTypes,
        reactTransformConstant,
        reactTransformInline,
      ],
    },
  },
});
