const { ReactLoadablePlugin } = require('react-loadable/webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { loadableAssetsFile, clientAssetsFile } = require('kyt-utils/paths')();

exports.kytWebpackPlugins = function kytWebpackPlugins(options) {
  const plugins = [];

  if (options.type === 'client') {
    plugins.push(
      new ReactLoadablePlugin({
        filename: loadableAssetsFile,
      })
    );

    plugins.push(
      new WebpackAssetsManifest({
        publicPath: options.publicPath,
        output: clientAssetsFile,
        writeToDisk: true,
      })
    );
  }

  return plugins;
};
