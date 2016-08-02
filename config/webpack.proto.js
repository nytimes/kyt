/**
  * Merges dev config
  * with the necessary changes for prototyping.
**/
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
module.exports = (options) => {
  const publicRoot = `http://localhost:${options.port}`;
  const publicPath = publicRoot + '/prototype';
  return {
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicRoot}`,
      path.resolve(__dirname, '../prototype/index.html'),
      path.resolve(__dirname, '../prototype/proto.js'),
    ],
    output: {
      path: path.join(options.basePath, 'build/prototype'),
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
