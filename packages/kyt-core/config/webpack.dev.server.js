// Development webpack config for server code

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { serverSrcPath, serverBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const postcssLoader = require('../utils/getPostcssLoader');
const getPolyfill = require('../utils/getPolyfill');

const cssStyleLoaders = [
  {
    loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[name]-[local]--[hash:base64:5]',
      exportOnlyLocals: true,
    },
  },
  postcssLoader,
];

module.exports = options => ({
  mode: 'development',

  target: 'node',

  devtool: 'cheap-module-eval-source-map',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: nodeExternals(),

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
        test: /\.css$/,
        use: [...cssStyleLoaders],
        exclude: [publicSrcPath],
      },
      {
        test: /\.scss$/,
        use: [...cssStyleLoaders, 'sass-loader'],
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
});
