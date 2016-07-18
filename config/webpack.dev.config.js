const path = require('path')
const autoprefixer = require('autoprefixer');
const remify = require('postcss-remify');
const webpack = require('webpack');
const fs = require('fs');

module.exports = function(options) {

  const publicPath = 'http://localhost:' + options.port + '/';

  return {
    debug: true,
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      // 'webpack/hot/only-dev-server',
      `webpack-dev-server/client?${publicPath}`,
      './src/index.js',
    ],
    output: {
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js',
      publicPath: publicPath,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
    devServer: {
      hot: true,
      contentBase: './src',
      publicPath: publicPath,
      stats: 'errors-only',
    },
  }
}
