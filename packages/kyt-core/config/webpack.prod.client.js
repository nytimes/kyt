
// Production webpack config for client code

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const { clientSrcPath, assetsBuildPath, buildPath } = require('kyt-utils/paths')();

const cssLoader = 'css-loader?modules&sourceMap&minimize&-autoprefixer&localIdentName=[name]-[local]--[hash:base64:5]!postcss-loader';

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
          use: cssLoader,
        }),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: `${cssLoader}!sass-loader`,
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
