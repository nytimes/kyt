// Production webpack config for client code
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const { kytWebpackPlugins } = require('kyt-runtime/webpack');
const postcssLoader = require('../utils/getPostcssLoader');
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

  module: {
    rules: [
      {
        test: /\.module\.(sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]-[local]--[hash:base64:5]',
              },
            },
          },
          postcssLoader,
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        exclude: [publicSrcPath],
      },
    ],
  },

  plugins: [
    ...kytWebpackPlugins(options),

    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[name]-[contenthash].css',
    }),

    new OptimizeCSSAssetsPlugin({}),
  ],

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
        styles: {
          name: `styles`,
          test: /\.s?css$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
});
