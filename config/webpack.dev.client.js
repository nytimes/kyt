
// Development webpack config for client code

const path = require('path');
const webpack = require('webpack');
const clone = require('ramda').clone;

const cssStyleLoaders = [
  'style',
  {
    loader: 'css',
    query: { modules: true, sourceMap: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];

module.exports = (options) => ({
  target: 'web',

  entry: {
    main: [
      'react-hot-loader/patch',
      `webpack-hot-middleware/client?reload=true&path=http://localhost:${options.clientPort}/__webpack_hmr`,
      path.join(options.userRootPath, 'src/client/index.js'),
    ],
  },

  output: {
    path: path.join(options.userRootPath, 'build/client'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'var',
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
});

