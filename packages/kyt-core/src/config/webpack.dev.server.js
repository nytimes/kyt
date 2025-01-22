// Development webpack config for server code

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { serverSrcPath, serverBuildPath, clientAssetsFile, loadableAssetsFile, publicSrcPath } =
  require('kyt-utils/paths')();
const { NodePackageImporter } = require('sass');
const StartServerPlugin = require('./StartServerPlugin');
const postcssLoader = require('../utils/getPostcssLoader');
const getPolyfill = require('./getPolyfill');

const nodeArgs = ['-r', 'source-map-support/register', '--max_old_space_size=4096'];
// Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
if (process.env.INSPECT_BRK) {
  nodeArgs.push(process.env.INSPECT_BRK);
} else if (process.env.INSPECT) {
  nodeArgs.push(process.env.INSPECT);
}

module.exports = options => {
  return {
    mode: 'development',

    watch: true,

    target: 'node',

    devtool: 'cheap-module-source-map',

    node: {
      __dirname: false,
      __filename: false,
    },

    externals: nodeExternals({
      modulesFromFile: true,
      allowlist: (options.externalModulesAllowlist || []).concat([/webpack\/hot\/poll\?300/]),
    }),

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
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  pkgImporter: new NodePackageImporter(),
                },
              },
            },
          ],
          exclude: [publicSrcPath],
        },
      ],
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
  };
};
