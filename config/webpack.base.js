
const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');
const assetsFile = 'assets.json';

module.exports = (options) => ({
  node: {
    __dirname: true,
    __filename: true
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(options.environment),
        SERVER_PORT: JSON.stringify(options.serverPort),
        CLIENT_PORT: JSON.stringify(options.clientPort || ''),
        PUBLIC_PATH: JSON.stringify(options.publicPath),
        CLIENT_BUILD_PATH: JSON.stringify(path.join(options.basePath, `build/client`)),
        SERVER_BUILD_PATH: JSON.stringify(path.join(options.basePath, `build/server`)),
        ASSETS_PATH: JSON.stringify(path.join(options.basePath, `build/client/${assetsFile}`)),
      },
    }),

    new AssetsPlugin({
      filename: assetsFile,
      path: options.assetsPath,
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          path.join(options.basePath, 'build'),
        ],
        query: {
          extends: path.join(__dirname, '../.babelrc'),
          babelrc: false,
        },
      },
    ]
  },
});
