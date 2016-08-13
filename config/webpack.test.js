
// Testing webpack config

const path = require('path');
const webpack = require.resolve('webpack');
const clone = require('ramda').clone;
// NOTE: This is the file path from the temporary test-src directory
const kytConfig = require('./kyt.config');
const logger = console;
const cssStyleLoaders = [
  'style',
  {
    loader: 'css',
    query: { modules: true, sourceMap: true, localIdentName: '[name]-[local]' },
  },
  'postcss',
];

const sassStyleLoaders = clone(cssStyleLoaders).concat('sass');
const options = {
  environment: "test",
  type: "test"
};
const testConfig = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: cssStyleLoaders,
      },
      {
        test: /\.scss$/,
        loaders: sassStyleLoaders,
      },
    ],
  }
};

module.exports = () => {
  // Uses kytConfig callback to merge with user webpack config
  let webpackConfig = null;
  try {
    webpackConfig = kytConfig.modifyWebpackConfig(testConfig, options);
    return webpackConfig;
  } catch(error) {
    logger.log('Error Loading the Test Webpack Config', error);
  }
};
