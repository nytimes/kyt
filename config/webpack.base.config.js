
const path = require('path');
const autoprefixer = require('autoprefixer');
const remify = require('postcss-remify');
const webpack = require('webpack');

module.exports = (options) => ({
  resolve: {
    extensions: ['', '.js', '.jsx'],
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
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
    remify,
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(options.environment),
    }),
  ],
});
