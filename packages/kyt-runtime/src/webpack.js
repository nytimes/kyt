const WebpackAssetsManifest = require('webpack-assets-manifest');
const { loadableAssetsFile, clientAssetsFile } = require('kyt-utils/paths')();
const { LoadablePlugin } = require('./loadable-plugin');

// eslint-disable-next-line import/prefer-default-export
export function kytWebpackPlugins(options) {
  const plugins = [];

  if (options.type === 'client') {
    plugins.push(
      new LoadablePlugin({
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
}
