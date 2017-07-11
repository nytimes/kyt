// All webpack configurations are merged into this
// base. See more about (smart) merging here:
// https://github.com/survivejs/webpack-merge

const path = require('path');
const webpack = require('webpack');
const shell = require('shelljs');
const { buildPath, userNodeModulesPath, userBabelrcPath } = require('kyt-utils/paths')();
const fileExtensions = require('./fileExtensions');

module.exports = options => {
  const hasBabelrc = shell.test('-f', userBabelrcPath);

  return {
    node: {
      __dirname: true,
      __filename: true,
    },

    devtool: 'source-map',

    resolve: {
      extensions: ['.js', '.json'],
      modules: [userNodeModulesPath, path.resolve(__dirname, '../node_modules')],
    },

    resolveLoader: {
      modules: [userNodeModulesPath, path.resolve(__dirname, '../node_modules')],
    },

    plugins: [
      new webpack.DefinePlugin({
        // Hardcode NODE_ENV at build time so libraries like React get optimized
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || options.environment),
        KYT: {
          SERVER_PORT: JSON.stringify((options.serverURL && options.serverURL.port) || ''),
          CLIENT_PORT: JSON.stringify((options.clientURL && options.clientURL.port) || ''),
          PUBLIC_PATH: JSON.stringify(options.publicPath || ''),
          PUBLIC_DIR: JSON.stringify(options.publicDir || ''),
          EXECUTION_ENVIRONMENT: JSON.stringify(options.type || ''),
          ASSETS_MANIFEST: JSON.stringify(
            path.join(buildPath || '', options.clientAssetsFile || '')
          ),
        },
      }),
    ],

    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'file-loader?name=[name].[ext]',
        },
        {
          test: new RegExp(fileExtensions),
          loader: 'url-loader',
          options: {
            limit: 20000,
          },
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: [/node_modules/, buildPath],
          // babel configuration should come from presets defined in the user's
          // .babelrc, unless there's a specific reason why it has to be put in
          // the webpack loader options
          options: Object.assign(
            {
              // this is a loader-specific option and can't be put in a babel preset
              cacheDirectory: false,
            },
            // add react hot loader babel plugin for development here--users
            // should only need to specify the reactHotLoader option in one place
            // (kyt.config.js), instead of two (kyt.config.js and .babelrc).
            // additionally, .babelrc has no notion of client vs server
            options.type === 'client' && options.reactHotLoader
              ? {
                  env: {
                    development: {
                      plugins: [require.resolve('react-hot-loader/babel')],
                    },
                  },
                }
              : {},
            // if the user hasn't defined a .babelrc, use the kyt default
            !hasBabelrc
              ? {
                  presets: [require.resolve('babel-preset-kyt-core')],
                }
              : {}
          ),
        },
      ],
    },
  };
};
