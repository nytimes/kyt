/**
  * Merges dev config
  * with the necessary changes for prototyping.
**/
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
module.exports = (options) => {
  const publicPath = `http://localhost:${options.port}/`;
  console.log(__dirname);
  return {
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicPath}`,
      path.resolve(__dirname, '../../../src/proto.js'),
    ],
    output: {
      path: path.resolve(__dirname, '../../../src'),
      filename: 'bundle.js',
      publicPath,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
    devServer: {
      publicPath,
      hot: true,
      contentBase: path.resolve(__dirname, '../../../src'),
      stats: 'errors-only',
    },
  };
};
