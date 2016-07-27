
const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');

module.exports = (options) => ({
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'kyt-utils': path.resolve('./node_modules/kyt/utils'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          extends: path.join(__dirname, '../.babelrc'),
          babelrc: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(options.environment),
    }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.resolve(__dirname, `./build`),
    })
  ],
});
