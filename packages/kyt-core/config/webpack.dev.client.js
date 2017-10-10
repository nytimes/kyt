// Development webpack config for client code

const webpack = require('webpack');
const clone = require('lodash.clonedeep');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const postcssLoader = require('../utils/getPostcssLoader');

const cssStyleLoaders = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: true,
      sourceMap: true,
      localIdentName: '[name]-[local]--[hash:base64:5]',
    },
  },
  postcssLoader,
];

module.exports = options => {
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
          exclude: [publicSrcPath],
        },
        {
          test: /\.scss$/,
          use: clone(cssStyleLoaders).concat('sass-loader'),
          exclude: [publicSrcPath],
        },
      ],
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),

      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
