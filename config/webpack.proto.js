
// Prototype config

const path = require('path');
const webpack = require('webpack');

module.exports = (options) => {
  const publicRoot = `http://localhost:${options.port}`;
  const publicPath = `${publicRoot}/prototype`;
  console.log('root', process.cwd());

  return {
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicRoot}`,
      path.resolve(__dirname, '../prototype/index.html'),
      path.resolve(process.cwd(), './prototype.js'),
    ],

    output: {
      path: path.join(options.userRootPath, 'build/prototype'),
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
      contentBase: path.resolve(process.cwd(), './src'),
      stats: 'errors-only',
    },
  };
};
