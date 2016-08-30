
// Testing webpack config

const clone = require('ramda').clone;
const nodeExternals = require('webpack-node-externals');
const { testBuildPath } = require('../utils/paths')();

const cssStyleLoaders = [
  {
    loader: 'css-loader/locals',
    query: { modules: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];

module.exports = () => ({

  devtool: 'inline-source-map',

  output: {
    path: testBuildPath,
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
