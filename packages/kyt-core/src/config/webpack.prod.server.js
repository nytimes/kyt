// Production webpack config for server code

const webpack = require('webpack');
const { serverSrcPath, serverBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const externals = require('./externals');
const postcssLoader = require('../utils/getPostcssLoader');
const getPolyfill = require('./getPolyfill');

module.exports = options => {
  return {
    mode: 'production',

    target: 'node',

    devtool: 'cheap-module-source-map',

    node: {
      __dirname: false,
      __filename: false,
    },

    externals: externals(options.allowList),

    entry: {
      main: [getPolyfill(options.type), `${serverSrcPath}/index.js`].filter(Boolean),
    },

    output: {
      path: serverBuildPath,
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: options.publicPath,
      libraryTarget: 'commonjs2',
    },

    module: {
      rules: [
        {
          test: /\.module\.(sc|c)ss$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]-[local]--[hash:base64:5]',
                  exportOnlyLocals: true,
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
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: true,
      }),
    ],
  };
};
