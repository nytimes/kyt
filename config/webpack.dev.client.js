
const path = require('path');
const webpack = require('webpack');

module.exports = (options) => ({
  target: 'web',

  entry: {
    main: [
      'react-hot-loader/patch',
      `webpack-hot-middleware/client?reload=true&path=http://localhost:${options.clientPort}/__webpack_hmr`,
      path.join(options.basePath, 'src/client/index.js'),
    ]
  },

  output: {
    path: path.join(options.basePath, 'build/client'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'var'
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
});

