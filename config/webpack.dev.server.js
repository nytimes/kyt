
// Development webpack config for server code

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

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

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
});
