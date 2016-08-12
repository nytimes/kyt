
// Prototype config

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


module.exports = (options) => {
  const publicRoot = `http://localhost:${options.port}`;
  const publicPath = `${publicRoot}/prototype`;

  return {
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicRoot}`,
      path.resolve(__dirname, '../prototype/index.html'),
      path.resolve(options.userRootPath, './prototype.js'),
    ],

    output: {
      path: path.join(options.userRootPath, 'build/prototype'),
      filename: 'bundle.js',
      publicPath,
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],

    devServer: {
      publicPath,
      hot: true,
      contentBase: path.resolve(options.userRootPath, './src'),
      stats: 'errors-only',
    },
  };
};
