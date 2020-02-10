// Production webpack config for server code

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { serverSrcPath, serverBuildPath } = require('kyt-utils/paths')();
const getPolyfill = require('../utils/getPolyfill');

module.exports = options => ({
  mode: 'production',

  target: 'node',

  devtool: 'source-map',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: [nodeExternals({ modulesDir: options.modulesDir })],

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

  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: true,
    }),
  ],
});
