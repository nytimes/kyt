
const path = require('path');
const webpack = require('webpack');

module.exports = (options) => ({
  target: 'web',

  devtool: 'hidden-source-map',

  entry: {
    main: [path.join(options.basePath, `src/client/index.js`)]
  },

  output: {
    path: path.join(options.basePath, `build/client`),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'var'
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
    }),
  ],
});
