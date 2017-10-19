// Production webpack config for client code

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const clone = require('lodash.clonedeep');
const postcssLoader = require('../utils/getPostcssLoader');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const HashOutput = require('webpack-plugin-hash-output');

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
    main: `${clientSrcPath}/index.js`,
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

    // Modules should get deterministic ids so that they don't change between builds
    new webpack.HashedModuleIdsPlugin(),

    // Extract all 3rd party modules into a separate chunk
    // Only include vendor modules as needed,
    // https://github.com/webpack/webpack/issues/2372#issuecomment-213149173
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),

    // Generate a 'manifest' chunk to be inlined
    new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' }),

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
