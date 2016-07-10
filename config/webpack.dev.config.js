const path = require('path')
const autoprefixer = require('autoprefixer');
const remify = require('postcss-remify');
const webpack = require('webpack');
const fs = require('fs');

module.exports = function(options) {
  return {
    debug: true,
    entry: [
      './src/index.js',
      'webpack-dev-server/client?http://localhost:' + options.port,
    ],
    output: {
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js',
      publicPath: 'http://localhost:' + options.port + '/',
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      contentBase: './src',
      port: options.port,
      host: 'localhost',
      // watchOptions: {
      //   aggregateTimeout: 300,
      // },
      stats: 'errors-only',
    },
  }
}
