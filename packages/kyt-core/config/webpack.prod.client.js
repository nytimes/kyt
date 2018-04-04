// Production webpack config for client code

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const clone = require('lodash.clonedeep');
const postcssLoader = require('../utils/getPostcssLoader');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const HashOutput = require('webpack-plugin-hash-output');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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

  mode: 'production',

  devtool: 'source-map',

  entry: {
    main: `${clientSrcPath}/index.js`,
  },

  output: {
    path: assetsBuildPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'var',
  },

  optimization: {
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
            name: "vendor",
            chunks: "all"
        },        
        main: {
          chunks: 'all',
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true
        },        
      }
    },
    minimize: true,
    minimizer: [
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     screw_ie8: true,
      //     warnings: false,
      //   },
      //   output: {
      //     comments: false,
      //   },
      //   sourceMap: true,
      // }),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          // mangle: true
        },
        sourceMap: true,
      })
    ]
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssStyleLoaders,
        }),
        exclude: [publicSrcPath],
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: clone(cssStyleLoaders).concat('sass-loader'),
        }),
        exclude: [publicSrcPath],
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name]-[contenthash].css',
      allChunks: true,
    }),

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

    // Webpack fingerprinting can break sometimes, this plugin will
    // guarantee that our hashes are deterministic, every build.
    new HashOutput({
      manifestFiles: ['manifest'],
    }),
  ],
});
