// Production webpack config for client code

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const HashOutput = require('webpack-plugin-hash-output');
const postcssLoader = require('../utils/getPostcssLoader');
const getPolyfill = require('../utils/getPolyfill');

module.exports = options => ({
  target: 'web',

  mode: 'production',

  devtool: 'source-map',

  entry: {
    main: [getPolyfill(options.type), `${clientSrcPath}/index.js`],
  },

  output: {
    path: assetsBuildPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'var',
  },

  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        main: {
          chunks: 'all',
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          },
        },
        sourceMap: true,
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]-[local]--[hash:base64:5]',
            },
          },
          postcssLoader,
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        exclude: [publicSrcPath],
      },
    ],
  },

  plugins: [
    // Webpack fingerprinting can break sometimes, this plugin will
    // guarantee that our hashes are deterministic, every build.
    new HashOutput({
      manifestFiles: ['manifest'],
    }),

    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),

    new OptimizeCSSAssetsPlugin({}),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    // Modules should get deterministic ids so that they don't change between builds
    new webpack.HashedModuleIdsPlugin(),

    // Merge bundles that would otherwise be negligibly small
    new webpack.optimize.AggressiveMergingPlugin(),

    // Scope Hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
});
