"use strict";

const babelPresetEnv = require('@babel/preset-env');

const babelTransformRuntime = require('@babel/plugin-transform-runtime');

const babelSyntaxDynamicImport = require('@babel/plugin-syntax-dynamic-import');

const merge = require('lodash.merge');

module.exports = function getPresetCore(context, opts) {
  opts = opts || {};
  const userEnvOptions = opts.envOptions || {};
  let envOptions = {};
  const baseOptions = {
    // modules are handled by webpack, don't transform them
    // however, scripts outside of Webpack will want these
    // transformed by default
    modules: process.env.KYT_ENV_TYPE ? false : 'commonjs',
    useBuiltIns: 'entry',
    corejs: 2,
    forceAllTransforms: true
  };
  const clientEnvOptions = { ...baseOptions,
    targets: {
      browsers: ['>1%', 'last 4 versions', 'not ie < 11']
    }
  };
  const serverEnvOptions = { ...baseOptions,
    targets: {
      node: 'current'
    }
  }; // Derive the babel-preset-env options based on the type of environment
  // we are in, client, server or test. Give the ability to users to override
  // the default environments in their own configurations, for example:
  //
  //  "presets": [["kyt-core", {
  //    "envOptions": {
  //      "client": { ... },
  //      "server": { ... },
  //    }
  //  }]]
  //

  if (process.env.KYT_ENV_TYPE === 'server') {
    envOptions = merge({}, serverEnvOptions, userEnvOptions.server || {});
  } else {
    envOptions = merge({}, clientEnvOptions, userEnvOptions.client || {});
  }

  return {
    presets: [[babelPresetEnv, envOptions]],
    // provide the ability to opt into babel-plugin-transform-runtime inclusion
    plugins: [opts.includeRuntime === true && babelTransformRuntime, babelSyntaxDynamicImport].filter(Boolean)
  };
};