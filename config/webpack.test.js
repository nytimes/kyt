
// Testing webpack config

const clone = require('ramda').clone;
const kytConfig = require('./kyt.config');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const fs = require('fs');

const logger = console;
const cssStyleLoaders = [
  'style',
  {
    loader: 'css',
    query: { modules: true, sourceMap: true, localIdentName: '[name]-[local]' },
  },
  'postcss',
];

const sassStyleLoaders = clone(cssStyleLoaders).concat('sass');
const userRootPath = kytConfig.userRootPath;
const options = {
  environment: 'test',
  type: 'test',
  userRootPath
};

// Create the babelrc query for the babel loader.
const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.babelrc'), 'utf8'));
// Uses require.resolve to add the full paths to all of the plugins
// and presets, making sure that we handle the new array syntax.
const resolvePluginsPresets = (babelGroup) => {
  babelGroup.plugins = (babelGroup.plugins || []).map((plugin) => {
    if (typeof plugin === 'object') {
      plugin[0] = require.resolve(plugin[0]);
      return plugin;
    }
    return require.resolve(plugin);
  });
  babelGroup.presets = (babelGroup.presets || []).map((preset) => {
    if (typeof preset === 'object') {
      preset[0] = require.resolve(preset[0]);
      return preset;
    }
    return require.resolve(preset);
  });
};
babelrc.babelrc = false;
babelrc.compact = false;
resolvePluginsPresets(babelrc);
Object.keys(babelrc.env || {}).forEach((env) => resolvePluginsPresets(babelrc.env[env]));


const testConfig = {
  output: {
    path: path.join(options.userRootPath, 'build/test'),
    filename: '[name].js'
  },
  resolve: {
  },
  externals: nodeExternals(),
  plugins: [],
  postcss: [],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: cssStyleLoaders,
      },
      {
        test: /\.scss$/,
        loaders: sassStyleLoaders,
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 20000,
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          path.join(options.userRootPath, 'build'),
        ],
        query: babelrc,
      },
    ],
  },
};


module.exports = () => {
  // Uses kytConfig callback to merge with user webpack config
  let webpackConfig = null;
  try {
    webpackConfig = kytConfig.modifyWebpackConfig(testConfig, options);
  } catch (error) {
    logger.log('Error Loading the Test Webpack Config', error);
  }
  return webpackConfig;
};
