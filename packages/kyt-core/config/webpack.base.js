// All webpack configurations are merged into this
// base. See more about (smart) merging here:
// https://github.com/survivejs/webpack-merge

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const shell = require('shelljs');
const merge = require('webpack-merge');

const {
  buildPath,
  userNodeModulesPath,
  userBabelrcPath,
  publicSrcPath,
} = require('kyt-utils/paths')();
const os = require('os');
const fileExtensions = require('./fileExtensions');

module.exports = options => {
  let babelrc;
  if (shell.test('-f', userBabelrcPath)) {
    const rcFile = fs.readFileSync(userBabelrcPath);
    babelrc = JSON.parse(rcFile);
  }

  return {
    node: {
      __dirname: true,
      __filename: true,
    },

    resolve: {
      extensions: ['.js', '.json'],
      modules: [userNodeModulesPath, path.resolve(__dirname, '../node_modules'), 'node_modules'],
    },

    resolveLoader: {
      modules: [userNodeModulesPath, path.resolve(__dirname, '../node_modules'), 'node_modules'],
    },

    plugins: [
      new WebpackBar({
        name: options.type === 'client' ? 'Client' : 'Server',
      }),

      new webpack.DefinePlugin({
        // Hardcode NODE_ENV at build time so libraries like React get optimized
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || options.environment),
        KYT: {
          SERVER_PORT: JSON.stringify((options.serverURL && options.serverURL.port) || ''),
          CLIENT_PORT: JSON.stringify((options.clientURL && options.clientURL.port) || ''),
          PUBLIC_PATH: JSON.stringify(options.publicPath || ''),
          PUBLIC_DIR: JSON.stringify(options.publicDir || ''),
          EXECUTION_ENVIRONMENT: JSON.stringify(options.type || ''),
          IS_BROWSER: options.type === 'client',
          ASSETS_MANIFEST: JSON.stringify(options.clientAssetsFile || ''),
          LOADABLE_MANIFEST: JSON.stringify(options.loadableAssetsFile || ''),
        },
      }),
    ],

    module: {
      rules: [
        {
          test: asset => {
            const extensions = new RegExp(fileExtensions);
            const jsCSSExtensions = new RegExp('\\.(js|css)$');
            const isFile = extensions.test(asset);
            const isJSOrCSSInPublic = asset.includes('/src/public/') && jsCSSExtensions.test(asset);
            return isFile || isJSOrCSSInPublic;
          },
          loader: 'file-loader',
          options: {
            name: '[name]-[hash].[ext]',
            publicPath: options.publicPath,
            outputPath: asset => (options.type === 'server' ? `../public/${asset}` : asset),
          },
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: [/node_modules/, buildPath, publicSrcPath],
          // babel configuration should come from presets defined in the user's
          // .babelrc, unless there's a specific reason why it has to be put in
          // the webpack loader options
          options: merge(
            {
              // this is a loader-specific option and can't be put in a babel preset
              babelrc: false,
              cacheDirectory:
                options.environment === 'development'
                  ? path.join(os.tmpdir(), 'babel-loader')
                  : false,
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
            babelrc || {
              presets: [require.resolve('babel-preset-kyt-core')],
            }
          ),
        },
      ],
    },
  };
};
