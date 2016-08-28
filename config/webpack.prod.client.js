
// Production webpack config for client code

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const clone = require('ramda').clone;

const cssStyleLoaders = [
  {
    loader: 'css',
    query: { modules: true, sourceMap: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];

module.exports = (options) => ({
  target: 'web',

  devtool: 'hidden-source-map',

  entry: {
    main: [path.join(options.userRootPath, 'src/client/index.js')],
  },

  output: {
    path: path.join(options.publicDirPath, 'assets'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'var',
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          notExtractLoader: 'style',
          loader: cssStyleLoaders,
        }),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          notExtractLoader: 'style',
          loader: clone(cssStyleLoaders).concat('sass'),
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', allChunks: true }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
    }),

    new AssetsPlugin({
      filename: options.clientAssetsFile,
      path: options.buildPath,
    }),
  ],
});
