// Development webpack config for client code

const webpack = require('webpack');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const postcssLoader = require('../utils/getPostcssLoader');
const getPolyfill = require('../utils/getPolyfill');

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
    getPolyfill(options.type),
    `${clientSrcPath}/index.js`,
  ];

  return {
    mode: 'development',

    target: 'web',

    devtool: 'cheap-module-eval-source-map',

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
      logLevel: 'silent',
      overlay: true,
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [...cssStyleLoaders],
          exclude: [publicSrcPath],
        },
        {
          test: /\.scss$/,
          use: [...cssStyleLoaders, 'sass-loader'],
          exclude: [publicSrcPath],
        },
      ],
    },

    plugins: [new webpack.HotModuleReplacementPlugin()],
  };
};
