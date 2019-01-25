// Production webpack config for client code

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const clone = require('lodash.clonedeep');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const HashOutput = require('webpack-plugin-hash-output');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { buildPath } = require('kyt-utils/paths')();
const postcssLoader = require('../utils/getPostcssLoader');
const getPolyfill = require('../utils/getPolyfill');

const cssStyleLoaders = [
  MiniCssExtractPlugin.loader,
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
  mode: 'production',

  target: 'web',

  devtool: 'source-map',

  entry: {
    main: [getPolyfill(options.type), `${clientSrcPath}/index.js`],
  },

  output: {
    path: assetsBuildPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssStyleLoaders,
        exclude: [publicSrcPath],
      },
      {
        test: /\.scss$/,
        use: clone(cssStyleLoaders).concat({
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }),
        exclude: [publicSrcPath],
      },
    ],
  },

  plugins: [
    new WebpackAssetsManifest({
      publicPath: options.publicPath,
      output: path.join(buildPath, options.clientAssetsFile),
    }),

    // Webpack fingerprinting can break sometimes, this plugin will
    // guarantee that our hashes are deterministic, every build.
    new HashOutput({
      manifestFiles: ['manifest'],
    }),

    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[name]-[contenthash].css',
    }),

    new OptimizeCSSAssetsPlugin({}),

    // Merge bundles that would otherwise be negligibly small
    new webpack.optimize.AggressiveMergingPlugin(),
  ],

  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
});
