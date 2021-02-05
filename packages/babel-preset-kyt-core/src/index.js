const babelPresetEnv = require('@babel/preset-env');
const babelPluginClassProperties = require('@babel/plugin-proposal-class-properties');
const babelPluginDecorators = require('@babel/plugin-proposal-decorators');
const babelPluginOptionalChaining = require('@babel/plugin-proposal-optional-chaining');
const babelTransformRuntime = require('@babel/plugin-transform-runtime');
const babelSyntaxDynamicImport = require('@babel/plugin-syntax-dynamic-import');
const babelDynamicImportNode = require('babel-plugin-dynamic-import-node');
const merge = require('lodash.merge');

module.exports = function getPresetCore(context, opts) {
  opts = opts || {};
  const userEnvOptions = opts.envOptions || {};
  let envOptions = {};

  const clientEnvOptions = {
    // modules are handled by webpack, don't transform them
    // however, scripts outside of Jest/Webpack will want these
    // transformed by default
    modules: process.env.KYT_ENV_TYPE ? false : 'commonjs',
    useBuiltIns: 'entry',
    corejs: 3,
    forceAllTransforms: true,
    targets: {
      browsers: ['>1%', 'last 4 versions', 'not ie < 11'],
    },
  };

  const serverEnvOptions = {
    // modules are handled by webpack, don't transform them
    // however, scripts outside of Jest/Webpack will want these
    // transformed by default
    modules: process.env.KYT_ENV_TYPE ? false : 'commonjs',
    useBuiltIns: 'entry',
    corejs: 3,
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
  if (process.env.KYT_ENV_TYPE === 'server') {
    envOptions = merge({}, serverEnvOptions, userEnvOptions.server ? userEnvOptions.server : {});
  } else if (process.env.KYT_ENV_TYPE === 'test') {
    envOptions = merge({}, userEnvOptions.test ? userEnvOptions.test : {});
    // Unless the user wants to define the transform-runtime plugin,
    // we needs to make sure it's true/added for tests.
    if (opts.includeRuntime === undefined) opts.includeRuntime = true;
  } else {
    envOptions = merge({}, clientEnvOptions, userEnvOptions.client ? userEnvOptions.client : {});
  }

  return {
    presets: [
      [babelPresetEnv, envOptions],
      // allow users to opt in to TypeScript support
      opts.typescript === true && '@babel/preset-typescript',
    ].filter(Boolean),

    plugins: [
      [babelPluginDecorators, { legacy: true }],
      [babelPluginClassProperties, { loose: true }],
      babelPluginOptionalChaining,
      // provide the ability to opt into babel-plugin-transform-runtime inclusion
      opts.includeRuntime === true && babelTransformRuntime,
      process.env.KYT_ENV_TYPE === 'test' ? babelDynamicImportNode : babelSyntaxDynamicImport,
    ].filter(Boolean),
  };
};
