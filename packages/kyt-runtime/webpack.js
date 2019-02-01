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

    if (options.environment === 'production') {
      plugins.push(
        new WebpackAssetsManifest({
          publicPath: options.publicPath,
          output: clientAssetsFile,
        })
      );
    }
  }

  return plugins;
};
