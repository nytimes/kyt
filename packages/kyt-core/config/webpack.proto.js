// Prototype config

const path = require('path');
const webpack = require('webpack');
const { userPrototypePath, prototypeBuildPath, srcPath } = require('kyt-utils/paths')();

module.exports = options => {
  const publicRoot = `http://localhost:${options.port}`;
  const publicPath = `${publicRoot}/prototype`;

  return {
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicRoot}`,
      path.resolve(__dirname, '../prototype/index.html'),
      userPrototypePath,
    ],

    output: {
      path: prototypeBuildPath,
      filename: 'bundle.js',
      publicPath,
    },

    plugins: [new webpack.HotModuleReplacementPlugin()],

    devServer: {
      publicPath,
      hot: true,
      contentBase: srcPath,
      stats: 'errors-only',
    },

    optimization: {
      noEmitOnErrors: true,
    },
  };
};
