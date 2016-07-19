
const path = require('path');
const webpack = require('webpack');

module.exports = (options) => {
  const publicPath = `http://localhost:${options.port}/`;

  return {
    debug: true,
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      // 'webpack/hot/only-dev-server',
      `webpack-dev-server/client?${publicPath}`,
      './src/index.js',
    ],
    output: {
      publicPath,
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js',
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
    devServer: {
      publicPath,
      hot: true,
      contentBase: './src',
      stats: 'errors-only',
    },
  };
};
