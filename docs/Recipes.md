# kyt Recipes

Easy ways to extend kyt.

## Table of Contents

1. [Extend Webpack Configuration](#extend-webpack-configuration)
1. [Add Webpack Aliases](#add-webpack-aliases)
1. [Add Babel Plugins and Presets](#add-babel-plugins-and-presets)
1. [Polyfilling](#polyfilling)

## Extend Webpack Configuration

In kyt.config.js, the [`modifyWebpackConfig`](/docs/kytConfig#modifyWebpackConfig) function is called any time a Webpack config is used.

It's called with two parameters:

1. baseConfig: The current Webpack config
2. options: an object of useful data for editing configuration

- environment: The environment the Webpack file will be used for [production, development, test]
- type: The type of config [client, server, test]

For example, if you want to add a new loader for only production code:

```javascript
if (options.environment === 'production') {
  // Add the appropriate loader
}
```

Or if you want to make a change only for client side code:

```javascript
if (options.type === 'client') {
  // Make changes here
}
```

## Add Webpack Aliases

In `kyt.config.js`:

```javascript
const path = require('path');

module.exports = {
  modifyWebpackConfig: (baseConfig, options) => {
    baseConfig.resolve.alias = {
      foo: path.resolve(process.cwd(), './src/foo'),
    };
    return baseConfig;
  };
};
```

## Polyfilling

If you created your application with a `starter-kyt` then you should be setup for polyfilling. A `starter-kyt` should configure one of the kyt presets -- [`babel-preset-kyt-core`](/packages/babel-preset-kyt-core/README.md) or [`babel-preset-kyt-react`](/packages/babel-preset-kyt-react/README.md) -- in your `.babelrc.js`. With this setup, kyt will target the current version of Node in the server build. For the client, a [browserslist](https://github.com/ai/browserslist) configuration is used to target a set of browsers and polyfill the features they are missing. You can read more about changing these options in the [`babel-preset-kyt-core` `envOptions` configuration](/packages/babel-preset-kyt-core/README.md#options).
