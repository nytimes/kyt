
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = (options) => ({
  target: 'node',

  externals: nodeExternals(),

  entry: {
    main: [
      path.join(options.basePath, `src/server/index.js`),
    ]
  },

  output: {
    path: path.join(options.basePath, `build/server`),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'commonjs2'
  },
});
