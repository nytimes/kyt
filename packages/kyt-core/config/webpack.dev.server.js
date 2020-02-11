// Development webpack config for server code

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const {
  serverSrcPath,
  serverBuildPath,
  clientAssetsFile,
  loadableAssetsFile,
} = require('kyt-utils/paths')();
const getPolyfill = require('../utils/getPolyfill');

const nodeArgs = ['-r', 'source-map-support/register'];
// Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
if (process.env.INSPECT_BRK) {
  nodeArgs.push(process.env.INSPECT_BRK);
} else if (process.env.INSPECT) {
  nodeArgs.push(process.env.INSPECT);
}

module.exports = options => ({
  mode: 'development',

  watch: true,

  target: 'node',

  devtool: 'cheap-module-source-map',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: [
    nodeExternals({
      modulesDir: options.modulesDir,
      whitelist: ['webpack/hot/poll?300'],
    }),
  ],

  entry: {
    main: [
      require.resolve('./prettyNodeErrors'),
      'webpack/hot/poll?300',
      getPolyfill(options.type),
      `${serverSrcPath}/index.js`,
    ].filter(Boolean),
  },

  output: {
    path: serverBuildPath,
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'commonjs2',
  },

  plugins: [
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new StartServerPlugin({
      name: 'main.js',
      nodeArgs,
    }),
    // Ignore to avoid infinite recompile bug
    new webpack.WatchIgnorePlugin([clientAssetsFile, loadableAssetsFile]),
  ],
});
