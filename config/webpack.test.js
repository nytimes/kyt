
// Testing webpack config

const clone = require('ramda').clone;
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const cssStyleLoaders = [
  {
    loader: 'css-loader/locals',
    query: { modules: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];

module.exports = (options) => ({

  devtool: 'inline-source-map',

  output: {
    path: path.join(options.userRootPath, 'build/test'),
    filename: '[name].js',
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
        loaders: clone(cssStyleLoaders).concat('sass'),
      },
    ],
  },
});
