/**
  * Merges dev config
  * with the necessary changes for prototyping.
**/
const path = require('path');
const webpack = require('webpack');
const devConfig = require('./webpack.dev.config.js');
const merge = require('webpack-merge');
module.exports = (options) => {
  const publicPath = `http://localhost:${options.port}/`;
  console.log(__dirname);
  return merge.smart(devConfig(options), {
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicPath}`,
      path.resolve(__dirname, '../../../src/proto.js'),
    ],
    devServer: {
      publicPath,
      hot: true,
      contentBase: path.resolve(__dirname, '../../../src'),
      stats: 'errors-only',
    },
  });
};
