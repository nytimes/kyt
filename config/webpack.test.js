
// Testing webpack config

const path = require('path');
const webpack = require.resolve('webpack');
const clone = require('ramda').clone;
const cssStyleLoaders = [
  'style',
  {
    loader: 'css',
    query: { modules: true, sourceMap: true, localIdentName: '[name]-[local]' },
  },
  'postcss',
];

const sassStyleLoaders = clone(cssStyleLoaders).concat('sass');

module.exports = {
  target: 'web',
  entry: [
    path.join(process.cwd(),'./src')
  ],
  output: {
    path: path.join(process.cwd(), 'build/test'),
  },

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
