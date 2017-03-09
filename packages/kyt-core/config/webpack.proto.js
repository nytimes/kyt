
// Prototype config

const path = require('path');
const webpack = require('webpack');
const clone = require('ramda').clone;
const { userPrototypePath, prototypeBuildPath, srcPath } = require('kyt-utils/paths')();

const cssStyleLoaders = [
  'style-loader',
  {
    loader: 'css-loader',
    options: { modules: true, sourceMap: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss-loader',
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
      userPrototypePath,
    ],

    output: {
      path: prototypeBuildPath,
      filename: 'bundle.js',
      publicPath,
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: cssStyleLoaders,
        },
        {
          test: /\.scss$/,
          use: clone(cssStyleLoaders).concat('sass-loader'),
        },
      ],
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],

    devServer: {
      publicPath,
      hot: true,
      contentBase: srcPath,
      stats: 'errors-only',
    },
  };
};
