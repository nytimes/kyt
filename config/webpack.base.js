
// Base webpack config

const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

const assetsFile = 'assets.json';

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
    else return require.resolve(plugin);
  });
  babelGroup.presets = (babelGroup.presets || []).map((preset) => {
    if (typeof preset === 'object') {
      preset[0] = require.resolve(preset[0]);
      return preset;
    }
    else return require.resolve(preset);
  });
};
babelrc.babelrc = false;
resolvePluginsPresets(babelrc);
Object.keys(babelrc.env || {}).forEach((env) => resolvePluginsPresets(babelrc.env[env]));

module.exports = (options) => ({
  node: {
    __dirname: true,
    __filename: true,
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.json'],
    modules: [`${options.userRootPath}/node_modules`, path.resolve(__dirname, '../node_modules')],
  },

  resolveLoader: {
    modules: [`${options.userRootPath}/node_modules`, path.resolve(__dirname, '../node_modules')],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(options.environment),
        SERVER_PORT: JSON.stringify(options.serverPort),
        CLIENT_PORT: JSON.stringify(options.clientPort || ''),
        PUBLIC_PATH: JSON.stringify(options.publicPath),
        CLIENT_BUILD_PATH: JSON.stringify(path.join(options.userRootPath, 'build/client')),
        SERVER_BUILD_PATH: JSON.stringify(path.join(options.userRootPath, 'build/server')),
        ASSETS_PATH: JSON.stringify(path.join(options.userRootPath, `build/client/${assetsFile}`)),
      },
    }),

    new AssetsPlugin({
      filename: assetsFile,
      path: options.assetsPath,
    }),
  ],

  postcss: [
    // Users should add their own postcss plugins for the css
    // and sass loaders through the `modifyWebpackConfig` callback.
  ],

  module: {
    loaders: [
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
});
