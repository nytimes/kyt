const babelPresetReact = require('@babel/preset-react');
const addReactDisplayName = require('babel-plugin-add-react-displayname');
const reactRemovePropTypes = require('babel-plugin-transform-react-remove-prop-types');
const reactTransformConstant = require('@babel/plugin-transform-react-constant-elements');
const reactTransformInline = require('@babel/plugin-transform-react-inline-elements');
const babelPresetKytCore = require('babel-preset-kyt-core');

module.exports = function getPresetReact(context, opts) {
  let useProductionTransforms = true;
  const productionTransforms = [reactRemovePropTypes];

  opts = opts || {};

  if ('useProductionTransforms' in opts) {
    useProductionTransforms = opts.useProductionTransforms;
  }

  if (useProductionTransforms === true) {
    productionTransforms.push(reactTransformConstant);
    productionTransforms.push(reactTransformInline);
  }

  return {
    plugins: [addReactDisplayName],
    env: {
      development: {
        presets: [
          [babelPresetReact, { development: true }],
          // pass options through to core preset
          [babelPresetKytCore, opts || {}],
        ],
      },
      test: {
        presets: [
          babelPresetReact,
          // pass options through to core preset
          [babelPresetKytCore, opts || {}],
        ],
      },
      production: {
        presets: [
          babelPresetReact,
          // pass options through to core preset
          [babelPresetKytCore, opts || {}],
        ],
        plugins: productionTransforms,
      },
    },
  };
};
