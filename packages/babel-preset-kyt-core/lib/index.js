/* eslint-disable vars-on-top */

var babelPresetEnv = require('babel-preset-env');
var babelTransformRuntime = require('babel-plugin-transform-runtime');
var babelTransformModules = require('babel-plugin-transform-es2015-modules-commonjs');
var babelSyntaxDynamicImport = require('babel-plugin-syntax-dynamic-import');

module.exports = function getPresetCore(context, opts) {
  opts = opts || {};
  var userEnvOptions = opts.envOptions || {};
  var envOptions = {};

  var clientEnvOptions = {
    modules: false,
    uglify: true,
    targets: {
      browsers: ['>1%', 'last 4 versions', 'not ie < 11'],
    },
  };

  var serverEnvOptions = {
    modules: false,
    targets: {
      node: true,
    },
  };

  // Derive the babel-preset-env options based on the type of environment
  // we are in, client or server. Give the ability to users to override
  // the default environments in their own configurations, for example:
  //
  //  "presets": [["kyt-core", {
  //    "envOptions": {
  //      "client": { ... },
  //      "server": { ... }
  //    }
  //  }]]
  //
  if (process.env.KYT_ENV_TYPE === 'client') {
    envOptions = Object.assign(
      {},
      clientEnvOptions,
      userEnvOptions.client ? userEnvOptions.client : {}
    );
  } else if (process.env.KYT_ENV_TYPE === 'server') {
    envOptions = Object.assign(
      {},
      serverEnvOptions,
      userEnvOptions.server ? userEnvOptions.server : {}
    );
  } else {
    envOptions = clientEnvOptions;
  }

  return {
    // modules are handled by webpack, don't transform them
    presets: [[babelPresetEnv, envOptions]],

    // provide the ability to opt into babel-plugin-transform-runtime inclusion
    plugins: [
      opts.includeRuntime === true && babelTransformRuntime,
      babelSyntaxDynamicImport,
    ].filter(Boolean),

    env: {
      test: {
        plugins: [[babelTransformModules, { loose: true }]],
      },
    },
  };
};
