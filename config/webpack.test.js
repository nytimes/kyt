
// Testing webpack config

const clone = require('ramda').clone;
const kytConfig = require('./kyt.config');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const fs = require('fs');

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

module.exports = (options) => ({
  output: {
    path: path.join(options.userRootPath, 'build/test'),
    filename: '[name].js'
  },
  externals: nodeExternals(),
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
});
