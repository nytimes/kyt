// Production webpack config for server code

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { serverSrcPath, serverBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const postcssLoader = require('../utils/getPostcssLoader');
const getPolyfill = require('./getPolyfill');

module.exports = options => {
  const externals = (options.externalModulesDir || ['node_modules']).map(modulesDir =>
    nodeExternals({
      modulesDir,
      allowlist: options.externalModulesAllowlist || [],
    })
  );

  return {
    mode: 'production',

    target: 'node',

    devtool: 'source-map',

    node: {
      __dirname: false,
      __filename: false,
    },

    externals,

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
