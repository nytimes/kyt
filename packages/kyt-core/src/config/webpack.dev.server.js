// Development webpack config for server code

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const {
  serverSrcPath,
  serverBuildPath,
  clientAssetsFile,
  loadableAssetsFile,
} = require('kyt-utils/paths')();
const StartServerPlugin = require('./StartServerPlugin');
const getPolyfill = require('./getPolyfill');

const nodeArgs = ['-r', 'source-map-support/register', '--max_old_space_size=4096'];
// Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
if (process.env.INSPECT_BRK) {
  nodeArgs.push(process.env.INSPECT_BRK);
} else if (process.env.INSPECT) {
  nodeArgs.push(process.env.INSPECT);
}

module.exports = options => {
  let externals;
  if (options.modulesDir && Array.isArray(options.modulesDir)) {
    externals = options.modulesDir.map(dir =>
      nodeExternals({
        modulesDir: dir,
        allowlist: ['webpack/hot/poll?300'],
      })
    );
  } else {
    externals = [
      nodeExternals({
        modulesDir: options.modulesDir,
        allowlist: ['webpack/hot/poll?300'],
      }),
    ];
  }

  return {
    mode: 'development',

    watch: true,

    target: 'node',

    devtool: 'cheap-module-source-map',

    node: {
      __dirname: false,
      __filename: false,
    },

    externals,

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
      new webpack.WatchIgnorePlugin({ paths: [clientAssetsFile, loadableAssetsFile] }),
    ],
  };
};
