const babelPresetReact = require('babel-preset-react');
// TODO add babel-preset-kyt-core to package.json and change it to an absolute
// require when the package is published... for now just use the filesystem :/
const babelPresetKytCore = require('../../babel-preset-kyt-core');
const reactRemovePropTypes = require('babel-plugin-transform-react-remove-prop-types');
const reactTransformConstantElements = require('babel-plugin-transform-react-constant-elements');

module.exports = {
  presets: [babelPresetReact, babelPresetKytCore],
  env: {
    production: {
      plugins: [
        reactRemovePropTypes,
        reactTransformConstantElements,
      ],
    },
  },
};
