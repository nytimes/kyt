// Development webpack config for client code

const webpack = require('webpack');
const { kytWebpackPlugins } = require('kyt-runtime/webpack');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const getPolyfill = require('../utils/getPolyfill');

module.exports = options => {
  const main = [
    `webpack-hot-middleware/client?reload=true&path=${options.clientURL.href}__webpack_hmr`,
    getPolyfill(options.type),
    `${clientSrcPath}/index.js`,
  ].filter(Boolean);

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

    plugins: [...kytWebpackPlugins(options), new webpack.HotModuleReplacementPlugin()],
  };
};
