const mergeAll = require('ramda').mergeAll;
const babel = require('../../config/babel')();
const babelJest = require('babel-jest');
const buildConfigs = require('../buildConfigs');

const { clientConfig } = buildConfigs();

// Merge userland babel config with our babel config
// TODO: This logic should probably move to config/babel.js,
// but that would be a breaking change.
const clientBabelConfig = clientConfig.module.loaders
  .find(loader => loader.loader === 'babel-loader')
  .query;

// TODO: What's sort of confusing here is that userland babel config
// (at least for Project-Vi) does not put things in babel.env's.
// It should. E.g. userland could define a .babelrc file and kyt should
// read it in and merge what's needed.
const babelConfigForJest = mergeAll([{}, babel, clientBabelConfig]);

module.exports = babelJest.createTransformer(babelConfigForJest);
