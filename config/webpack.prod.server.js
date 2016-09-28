
// Production webpack config for server code

const nodeExternals = require('webpack-node-externals');
const clone = require('ramda').clone;
const { serverSrcPath, serverBuildPath } = require('../utils/paths')();

const cssStyleLoaders = [
  {
    loader: 'css-loader/locals',
    options: { modules: true, localIdentName: '[name]-[local]--[hash:base64:5]' },
  },
  'postcss',
];

module.exports = options => ({
  target: 'node',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: nodeExternals(),

  entry: {
    main: [`${serverSrcPath}/index.js`],
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
        use: cssStyleLoaders,
      },
      {
        test: /\.scss$/,
        use: clone(cssStyleLoaders).concat('sass'),
      },
    ],
  },

});
