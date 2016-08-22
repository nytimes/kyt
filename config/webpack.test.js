
// Testing webpack config

const clone = require('ramda').clone;
const kytConfig = require('./kyt.config');
const path = require('path');

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
const userRootPath = kytConfig.userRootPath;
const options = {
  environment: 'test',
  type: 'test',
  userRootPath,
};
const babelrc = {};
babelrc.babelrc = false;
babelrc.presets = [];
babelrc.plugins = [];

const testConfig = {
  resolve: {
  },
  plugins: [],
  postcss: [],
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
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 20000,
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          path.join(options.userRootPath, 'build'),
        ],
        query: babelrc,
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
