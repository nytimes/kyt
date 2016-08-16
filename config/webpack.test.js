
// Testing webpack config

const clone = require('ramda').clone;
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
  environment: 'test',
  type: 'test',
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
  },
};

module.exports = () => {
  // Uses kytConfig callback to merge with user webpack config
  let webpackConfig = null;
  try {
    webpackConfig = kytConfig.modifyWebpackConfig(testConfig, options);
  } catch (error) {
    logger.log('Error Loading the Test Webpack Config', error);
  }
  return webpackConfig;
};
