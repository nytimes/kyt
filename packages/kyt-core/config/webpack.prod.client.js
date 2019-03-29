// Production webpack config for client code

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { clientSrcPath, assetsBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const { kytWebpackPlugins } = require('kyt-runtime/webpack');
const TerserPlugin = require('terser-webpack-plugin');
const postcssLoader = require('../utils/getPostcssLoader');
const getPolyfill = require('../utils/getPolyfill');

const cssStyleLoaders = [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[name]-[local]--[hash:base64:5]',
    },
  },
  postcssLoader,
];

module.exports = options => ({
  mode: 'production',

  target: 'web',

  devtool: 'source-map',

  entry: {
    main: [getPolyfill(options.type), `${clientSrcPath}/index.js`],
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
        test: /\.css$/,
        use: [...cssStyleLoaders],
        exclude: [publicSrcPath],
      },
      {
        test: /\.scss$/,
        use: [
          ...cssStyleLoaders,
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
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          compress: true,
          ecma: 6,
          // mangle: true
        },
        sourceMap: true,
      }),
    ],
  },
});
