
// Development webpack config for server code

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const autoprefixer = require('autoprefixer');
const clone = require('ramda').clone;
const { serverSrcPath, serverBuildPath } = require('../utils/paths')();

const cssStyleLoaders = [
  {
    loader: 'css-loader/locals',
    query: { modules: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];

module.exports = (options) => ({
  target: 'node',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: nodeExternals(),

  entry: {
    main: [`${serverSrcPath}/index.js`],
  },

  output: {
    path: serverBuildPath,
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

  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
});
