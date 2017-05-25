
// Production webpack config for client code

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const clone = require('lodash.clonedeep');
const postcssLoader = require('../utils/getPostcssLoader');
const { clientSrcPath, assetsBuildPath, buildPath } = require('kyt-utils/paths')();

const cssStyleLoaders = [
  {
    loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[name]-[local]--[hash:base64:5]',
    },
  },
  postcssLoader,
];

module.exports = options => ({
  target: 'web',

  devtool: 'source-map',

  entry: {
    main: ['babel-polyfill', `${clientSrcPath}/index.js`],
  },

  output: {
    path: assetsBuildPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'var',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssStyleLoaders,
        }),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: clone(cssStyleLoaders).concat('sass-loader'),
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name]-[chunkhash].css',
      allChunks: true,
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),

    new AssetsPlugin({
      filename: options.clientAssetsFile,
      path: buildPath,
    }),
  ],
});
