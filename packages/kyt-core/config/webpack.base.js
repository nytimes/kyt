// All webpack configurations are merged into this
// base. See more about (smart) merging here:
// https://github.com/survivejs/webpack-merge

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const shell = require('shelljs');
const merge = require('lodash.merge');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const {
  buildPath,
  userNodeModulesPath,
  userBabelrcPath,
  publicSrcPath,
} = require('kyt-utils/paths')();
const fileExtensions = require('./fileExtensions');

let clientAssets;

module.exports = options => {
  const hasBabelrc = shell.test('-f', userBabelrcPath);
  const assetsFilePath = path.join(buildPath, options.clientAssetsFile);

  return {
    node: {
      __dirname: true,
      __filename: true,
    },

    devtool: 'source-map',

    resolve: {
      extensions: ['.js', '.json'],
      modules: [userNodeModulesPath, path.resolve(__dirname, '../node_modules'), 'node_modules'],
    },

    resolveLoader: {
      modules: [userNodeModulesPath, path.resolve(__dirname, '../node_modules'), 'node_modules'],
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

      new WebpackAssetsManifest({
        output: assetsFilePath,
        space: 2,
        fileExtRegex: /\.\w{2,4}\.(?:map|gz)$|\.\w+$/i,
        writeToDisk: options.type === 'client',
        done: manifest => {
          // This plugin's `merge` doesn't work as expected. The "done" callback
          // gets called for the client and server asset builds, in that order.
          if (options.type === 'client') {
            // Save the client assets for merging later.
            clientAssets = manifest.toJSON();
          } else {
            // Merge the server assets into the client assets and write the result to disk.
            const assets = merge({}, clientAssets, manifest.toJSON());
            fs.writeFile(assetsFilePath, JSON.stringify(assets, null, '  '), 'utf8');
          }
        },
        customize: (key, value) => {
          const prependPublicPath = asset => `${options.publicPath || ''}${asset}`;
          const removePublicDir = asset => asset.replace(/(.*)?public\//, '');

          // Server asset files have "../public" prepended to them
          // (see file-loader `outputPath`). We need to remove that.
          if (options.type === 'server') {
            if (value.startsWith('../public')) {
              key = removePublicDir(key);
              value = prependPublicPath(removePublicDir(value));
            } else {
              return false;
            }
          } else {
            value = prependPublicPath(value);
          }

          return { key, value };
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
