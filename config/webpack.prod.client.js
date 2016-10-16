
// Production webpack config for client code

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const { clientSrcPath, assetsBuildPath, buildPath } = require('../utils/paths')();

const cssLoader = 'css?modules&sourceMap&localIdentName=[name]-[local]--[hash:base64:5]!postcss';

module.exports = options => ({
  target: 'web',

  devtool: 'source-map',

  entry: {
    main: [`${clientSrcPath}/index.js`],
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
          fallbackLoader: 'style',
          loader: cssLoader,
        }),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: `${cssLoader}!sass`,
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
