
const path = require('path');
const webpack = require('webpack');

module.exports = (options) => {
  const publicPath = `http://localhost:${options.port}/`;

  let entry;

  if (options.server) {
    entry = [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      path.resolve(__dirname, '../../../src/client.js'),
    ];
  } else {
    entry = [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicPath}`,
      path.resolve(__dirname, '../../../src/client.js'),
    ];
  }

  return {
    debug: true,

    entry,

    output: {
      path: path.resolve(__dirname, '../../../src'),
      filename: 'bundle.js',
      publicPath,
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],

    devServer: {
      publicPath,
      hot: true,
      contentBase: path.resolve(__dirname, '../../src'),
      stats: 'errors-only',
    },
  };
};
