const mergeAll = require('ramda').mergeAll;
const babel = require('../../config/babel')();
const babelJest = require('babel-jest');
const buildConfigs = require('../buildConfigs');
const config = require('../kytConfig')();

const { clientConfig } = buildConfigs(config);

// Merge userland babel config with our babel config
// This should go away after https://github.com/NYTimes/kyt/issues/134
const clientBabelConfig = clientConfig.module.rules
  .find(loader => loader.loader === 'babel-loader')
  .options;

const babelConfigForJest = mergeAll([{}, babel, clientBabelConfig]);

module.exports = babelJest.createTransformer(babelConfigForJest);
