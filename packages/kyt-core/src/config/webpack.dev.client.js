// Development webpack config for client code
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const { kytWebpackPlugins } = require('kyt-runtime/webpack');
const { clientSrcPath, assetsBuildPath, publicBuildPath, publicSrcPath } =
  require('kyt-utils/paths')();
const getPolyfill = require('./getPolyfill');
const postcssLoader = require('../utils/getPostcssLoader');

module.exports = options => {
  const main = [
    require.resolve('./webpackHotDevClient'),
    getPolyfill(options.type),
    `${clientSrcPath}/index.js`,
  ].filter(Boolean);

  return {
    mode: 'development',

    target: 'web',

    devtool: 'cheap-module-source-map',

    entry: {
      main,
    },

    output: {
      path: assetsBuildPath,
      publicPath: options.publicPath,
      pathinfo: true,
      libraryTarget: 'var',
      filename: '[name].js',
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
      // load hashed files from `build/public`
      contentBase: publicBuildPath,
      host: options.clientURL.hostname,
      hot: true,
      noInfo: true,
      overlay: false,
      port: options.clientURL.port,
      // By default files from `contentBase` will not trigger a page reload.
      quiet: true,
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

    module: {
      rules: [
        {
          test: /\.module\.(sc|c)ss$/,
          use: [
            // 'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: {
                  localIdentName: '[name]-[local]--[hash:base64:5]',
                  // exportOnlyLocals: true,
                },
              },
            },
            postcssLoader,
            'sass-loader',
          ],
          exclude: [publicSrcPath],
        },
      ],
    },

    plugins: [
      ...kytWebpackPlugins(options),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
