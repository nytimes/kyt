# kyt Recipes

Easy ways to extend kyt.

## Table of Contents

1. [Extend Webpack Configuration](#extend-webpack-configuration)
1. [Add Webpack Aliases](#add-webpack-aliases)
1. [Add Babel Plugins and Presets](#add-babel-plugins-and-presets)

## Extend Webpack Configuration

In kyt.config.js, the [`modifyWebpackConfig`](/docs/kytConfig#modifyWebpackConfig) function is called any time a Webpack config is used.

It's called with two parameters:

1. baseConfig: The current Webpack config
2. options: an object of useful data for editing configuration

- environment: The environment the Webpack file will be used for [production, development, test, prototype]
- type: The type of config [client, server, test, prototype]

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

In `kyt.config.js`

```javascript
modifyWebpackConfig: (baseConfig, options) => {
  baseConfig.resolve.alias = {
    myAliasFolder: require('path').resolve(process.cwd(), './src/path/to/my/folder'),
  };
  return baseConfig;
};
```

## Add Babel Plugins and Presets

As of v0.4.0, kyt respects user `.babelrc` files.

```bash
npm i --save-dev my-babel-plugin
```

in `.babelrc.js`

```js
module.exports = {
  presets: ['babel-preset-kyt-core'],
  plugins: ['my-babel-plugin'],
};
```

Check out the current [Babel configuration](/.babelrc.js).

## Polyfilling

If you created your application with a starter-kyt then you should be setup for polyfilling. A starter-kyt should configure one of the kyt presets -- [`babel-preset-kyt-core`](/packages/babel-preset-kyt-core/README.md) or [`babel-preset-kyt-react`](/packages/babel-preset-kyt-react/README.md) -- in your .babelrc and should add a `babel-polyfill` dependency to your package.json and import it at the top of `src/server/index.js` and `src/client/index.js`. With this setup, kyt will target the current version of Node in the server build. For the client, a [browserlist](https://github.com/ai/browserslist) configuration is used to target a set of browsers and polyfill the features they are missing. You can read more about changing these options in the [`babel-preset-kyt-core` `envOptions` configuration](/packages/babel-preset-kyt-core/README.md#options).

## Editor Configuration

A kyt app should work with any editor but we recommend that you install and configure one of the following editors to work best with kyt's linters:

### Atom

1. go to atom preferences > `Install`
1. Install `linter`
1. Install `linter-eslint`
1. Install `prettier-atom` - in the prettier atom Settings, check the `ESLint Integration` checkbox.
1. Make sure all packages are enabled. You may need to restart Atom.

### VSCode

1. go to View > Extensions
1. Install `ESLint`
1. Install `Prettier`
1. to to Code > Preferences
1. Change the following preferences to `true`:

```
"prettier.eslintIntegration": true,
"editor.formatOnSave": true
```
