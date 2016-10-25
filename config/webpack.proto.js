
// Prototype config

const path = require('path');
const webpack = require('webpack');
const clone = require('ramda').clone;
const { userPrototypePath, prototypeBuildPath, srcPath } = require('../utils/paths')();

const cssStyleLoaders = [
  'style',
  {
    loader: 'css',
    query: { modules: true, sourceMap: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];


module.exports = (options) => {
  const publicRoot = `http://localhost:${options.port}`;
  const publicPath = `${publicRoot}/prototype`;

  return {
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicRoot}`,
      path.resolve(__dirname, '../prototype/index.html'),
      userPrototypePath,
    ],

    output: {
      path: prototypeBuildPath,
      filename: 'bundle.js',
      publicPath,
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: cssStyleLoaders,
        },
        {
          test: /\.scss$/,
          use: clone(cssStyleLoaders).concat('sass'),
        },
      ],
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],

    devServer: {
      publicPath,
      hot: true,
      contentBase: srcPath,
      stats: 'errors-only',
    },
  };
};
