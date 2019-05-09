/* eslint-disable vars-on-top */

var babelPresetEnv = require('@babel/preset-env');
var babelTransformRuntime = require('@babel/plugin-transform-runtime');
var babelSyntaxDynamicImport = require('@babel/plugin-syntax-dynamic-import');
var babelDynamicImportNode = require('babel-plugin-dynamic-import-node');
var merge = require('lodash.merge');

module.exports = function getPresetCore(context, opts) {
  opts = opts || {};
  var userEnvOptions = opts.envOptions || {};
  var envOptions = {};

  var clientEnvOptions = {
    modules: 'commonjs',
    useBuiltIns: 'entry',
    forceAllTransforms: true,
    targets: {
      browsers: ['>1%', 'last 4 versions', 'not ie < 11'],
    },
  };

  var serverEnvOptions = {
    modules: 'commonjs',
    useBuiltIns: 'entry',
    forceAllTransforms: true,
    targets: {
      node: 'current',
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
    // modules are handled by webpack, don't transform them
    clientEnvOptions.modules = false;
    envOptions = merge({}, clientEnvOptions, userEnvOptions.client ? userEnvOptions.client : {});
  } else if (process.env.KYT_ENV_TYPE === 'server') {
    // modules are handled by webpack, don't transform them
    serverEnvOptions.modules = false;
    envOptions = merge({}, serverEnvOptions, userEnvOptions.server ? userEnvOptions.server : {});
  } else if (process.env.KYT_ENV_TYPE === 'test') {
    envOptions = merge({}, userEnvOptions.test ? userEnvOptions.test : {});
    // Unless the user wants to define the transform-runtime plugin,
    // we needs to make sure it's true/added for tests.
    if (opts.includeRuntime === undefined) opts.includeRuntime = true;
  } else {
    envOptions = clientEnvOptions;
  }

  return {
    presets: [[babelPresetEnv, envOptions]],

    // provide the ability to opt into babel-plugin-transform-runtime inclusion
    plugins: [
      opts.includeRuntime === true && babelTransformRuntime,
      process.env.KYT_ENV_TYPE === 'test' ? babelDynamicImportNode : babelSyntaxDynamicImport,
    ].filter(Boolean),
  };
};
