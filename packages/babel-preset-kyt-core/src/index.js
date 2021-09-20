const merge = require('lodash.merge');
const pkg = require('../package');

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
    corejs: pkg.dependencies['core-js'],
    forceAllTransforms: true,
    targets: {
      browsers: ['>1%', 'last 4 versions', 'not ie < 11'],
    },
    /**
     * Ensure that certain plugins added by `@babel/preset-env` match the `loose: true`
     * configuration option we set below for both `@babel/plugin-proposal-class-properties`
     * and `@babel/plugin-proposal-private-methods`
     */
    loose: true,
  };

  const serverEnvOptions = {
    // modules are handled by webpack, don't transform them
    // however, scripts outside of Jest/Webpack will want these
    // transformed by default
    modules: process.env.KYT_ENV_TYPE ? false : 'commonjs',
    useBuiltIns: 'entry',
    corejs: pkg.dependencies['core-js'],
    forceAllTransforms: true,
    targets: {
      node: 'current',
    },
    /**
     * Ensure that certain plugins added by `@babel/preset-env` match the `loose: true`
     * configuration option we set below for both `@babel/plugin-proposal-class-properties`
     * and `@babel/plugin-proposal-private-methods`
     */
    loose: true,
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
    presets: [['@babel/preset-env', envOptions]],

    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      // needed to suppress warnings about mismatched "loose" values across plugins
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      '@babel/plugin-proposal-optional-chaining',
      // provide the ability to opt into babel-plugin-transform-runtime inclusion
      opts.includeRuntime === true && '@babel/plugin-transform-runtime',
      process.env.KYT_ENV_TYPE === 'test'
        ? 'babel-plugin-dynamic-import-node'
        : '@babel/plugin-syntax-dynamic-import',
    ].filter(Boolean),
  };
};
