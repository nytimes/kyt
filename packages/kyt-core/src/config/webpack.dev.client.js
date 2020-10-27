// Development webpack config for client code
const path = require('path');
const webpack = require('webpack');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const { kytWebpackPlugins } = require('kyt-runtime/webpack');
const { clientSrcPath, assetsBuildPath } = require('kyt-utils/paths')();
const getPolyfill = require('./getPolyfill');

module.exports = options => {
  const main = [
    require.resolve('./webpackHotDevClient'),
    getPolyfill(options.type),
    `${clientSrcPath}/index.js`,
  ].filter(Boolean);

  return {
    mode: 'development',

    target: ['web', 'es5'],

    devtool: 'cheap-module-source-map',

    entry: {
      main,
    },

    output: {
      path: assetsBuildPath,
      publicPath: options.publicPath,
      pathinfo: true,
      libraryTarget: 'var',
      chunkFilename: '[name]-[chunkhash].js',
      devtoolModuleFilenameTemplate: info => path.resolve(info.resourcePath).replace(/\\/g, '/'),
    },

    devServer: {
      disableHostCheck: true,
      clientLogLevel: 'none',
      compress: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: {
        // Paths with dots should still use the history fallback.
        // See https://github.com/facebookincubator/create-react-app/issues/387.
        disableDotRule: true,
      },
      publicPath: options.publicPath,
      host: options.clientURL.hostname,
      hot: true,
      noInfo: true,
      overlay: false,
      port: options.clientURL.port,
      quiet: true,
      // By default files from `contentBase` will not trigger a page reload.
      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/,
      },
      before(app) {
        // This lets us open files from the runtime error overlay.
        app.use(errorOverlayMiddleware());
      },
    },

    plugins: [...kytWebpackPlugins(options), new webpack.HotModuleReplacementPlugin()],
  };
};
