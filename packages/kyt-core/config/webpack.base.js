
// All webpack configurations are merged into this
// base. See more about (smart) merging here:
// https://github.com/survivejs/webpack-merge

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const babel = require('./babel');
const { buildPath, userNodeModulesPath } = require('../utils/paths')();

module.exports = options => ({
  node: {
    __dirname: true,
    __filename: true,
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.json'],
    modules: [userNodeModulesPath, path.resolve(__dirname, '../node_modules')],
  },

  resolveLoader: {
    modules: [userNodeModulesPath, path.resolve(__dirname, '../node_modules')],
  },

  plugins: [
    new webpack.DefinePlugin({
      // Hardcode NODE_ENV at build time so libraries like React get optimized
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || options.environment),
      KYT: {
        SERVER_PORT: JSON.stringify((options.serverURL && options.serverURL.port) || ''),
        CLIENT_PORT: JSON.stringify((options.clientURL && options.clientURL.port) || ''),
        PUBLIC_PATH: JSON.stringify(options.publicPath || ''),
        PUBLIC_DIR: JSON.stringify(options.publicDir || ''),
        ASSETS_MANIFEST:
            JSON.stringify(path.join(buildPath || '', options.clientAssetsFile || '')),
      },
    }),

    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
        context: '/',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
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
          buildPath,
        ],
        options: babel(options),
      },
    ],
  },
});
