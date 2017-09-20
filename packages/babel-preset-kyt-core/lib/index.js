/* eslint-disable vars-on-top */

var babelPresetEnv = require('babel-preset-env');
var babelTransformRuntime = require('babel-plugin-transform-runtime');
var babelSyntaxDynamicImport = require('babel-plugin-syntax-dynamic-import');
var merge = require('lodash.merge');

module.exports = function getPresetCore(context, opts) {
  opts = opts || {};
  var userEnvOptions = opts.envOptions || {};
  var envOptions = {};

  var clientEnvOptions = {
    modules: false,
    targets: {
      uglify: true,
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
  // we are in, client, server or test. Give the ability to users to override
  // the default environments in their own configurations, for example:
  //
  //  "presets": [["kyt-core", {
  //    "envOptions": {
  //      "client": { ... },
  //      "server": { ... },
  //      "test": { ... }
  //    }
  //  }]]
  //
  if (process.env.KYT_ENV_TYPE === 'client') {
    envOptions = merge({}, clientEnvOptions, userEnvOptions.client ? userEnvOptions.client : {});
  } else if (process.env.KYT_ENV_TYPE === 'server') {
    envOptions = merge({}, serverEnvOptions, userEnvOptions.server ? userEnvOptions.server : {});
  } else if (process.env.KYT_ENV_TYPE === 'test') {
    envOptions = merge({}, userEnvOptions.test ? userEnvOptions.test : {});
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
  };
};
