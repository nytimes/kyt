
const path = require('path');
const autoprefixer = require('autoprefixer');
const remify = require('postcss-remify');
const webpack = require('webpack');
const fs = require('fs');

module.exports = function(options) {
  return {
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: 'file?name=[name].[ext]'
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
          }
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loaders: ['style', 'css?modules&sourceMap&importLoaders=1&localIdentName=[name]-[local]--[hash:base64:5]'],
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]-[local]--[hash:base64:5]',
            'postcss-loader',
            'sass-loader',
          ]
        },
      ],
    },
    postcss: [
      autoprefixer({ browsers: ['last 2 versions'] }),
      remify,
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.environment)
      }),
    ],
  }
}
