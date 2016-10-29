
// Development webpack config for client code

const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const clone = require('ramda').clone;
const { clientSrcPath, buildPath, assetsBuildPath } = require('../utils/paths')();

const cssStyleLoaders = [
  'style',
  {
    loader: 'css',
    options: { modules: true, sourceMap: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];

module.exports = (options) => {
  const main = [
    `webpack-hot-middleware/client?reload=true&path=${options.clientURL.href}__webpack_hmr`,
    `${clientSrcPath}/index.js`,
  ];

  if (options.reactHotLoader) main.unshift('react-hot-loader/patch');

  return {
    target: 'web',

    devtool: 'inline-source-map',

    entry: {
      main,
    },

    output: {
      path: assetsBuildPath,
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: options.publicPath,
      libraryTarget: 'var',
    },

    devServer: {
      publicPath: options.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      noInfo: true,
      quiet: true,
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: cssStyleLoaders,
        },
        {
          test: /\.scss$/,
          use: clone(cssStyleLoaders).concat('sass'),
        },
      ],
    },

    plugins: [
      new webpack.NoErrorsPlugin(),

      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

      new AssetsPlugin({
        filename: options.clientAssetsFile,
        path: buildPath,
      }),

      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
