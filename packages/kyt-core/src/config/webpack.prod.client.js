// Production webpack config for client code

const { clientSrcPath, assetsBuildPath } = require('kyt-utils/paths')();
const { kytWebpackPlugins } = require('kyt-runtime/webpack');
const getPolyfill = require('./getPolyfill');

module.exports = options => ({
  mode: 'production',

  target: 'web',

  devtool: 'source-map',

  entry: {
    main: [getPolyfill(options.type), `${clientSrcPath}/index.js`].filter(Boolean),
  },

  output: {
    path: assetsBuildPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
  },

  plugins: [...kytWebpackPlugins(options)],

  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`,
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
});
