
// Development webpack config for server code

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const clone = require('ramda').clone;

const cssStyleLoaders = [
  {
    loader: 'css-loader/locals',
    query: { modules: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];

module.exports = (options) => ({
  target: 'node',

  externals: nodeExternals(),

  entry: {
    main: [
      path.join(options.userRootPath, 'src/server/index.js'),
    ],
  },

  output: {
    path: path.join(options.userRootPath, 'build/server'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'commonjs2',
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: cssStyleLoaders,
      },
      {
        test: /\.scss$/,
        loaders: clone(cssStyleLoaders).concat('sass'),
      },
    ],

  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
});
