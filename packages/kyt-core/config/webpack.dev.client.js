// Development webpack config for client code

const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const clone = require('lodash.clonedeep');
const path = require('path');
const { clientSrcPath, buildPath, assetsBuildPath } = require('kyt-utils/paths')();
const postcssLoader = require('../utils/getPostcssLoader');

const cssStyleLoaders = [
  'style-loader',
  {
    loader: 'css-loader',
    options: { modules: true, sourceMap: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  postcssLoader,
];

module.exports = options => {
  const main = [
    'babel-polyfill',
    `webpack-hot-middleware/client?reload=true&path=${options.clientURL.href}__webpack_hmr`,
    `${clientSrcPath}/index.js`,
  ];

  // Because of an ie11 bug, 'react-hot-loader/patch' needs to come after 'babel-polyfill'
  // https://github.com/facebook/react/issues/8379#issuecomment-273489824
  if (options.reactHotLoader)
    main.splice(main.indexOf('babel-polyfill') + 1, 0, 'react-hot-loader/patch');

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
          use: clone(cssStyleLoaders).concat('sass-loader'),
        },
      ],
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),

      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

      new WebpackAssetsManifest({
        output: path.join(buildPath, options.clientAssetsFile),
        space: 2,
        writeToDisk: true,
        fileExtRegex: /\.\w{2,4}\.(?:map|gz)$|\.\w+$/i,
        merge: false,
        publicPath: options.publicPath,
      }),

      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
