# kyt Recipes

Easy ways to extend kyt.

## Table of Contents

  1. [Extend Webpack Configuration](#extend-webpack-configuration)
  1. [Add Webpack Aliases](#add-webpack-aliases)
  1. [Add PostCSS Plugins](#add-postcss-plugins)
  1. [Add Babel Plugins and Presets](#add-babel-plugins-and-presets)
  1. [Add always-mocked modules to Jest configuration](#add-always-mocked-modules-to-jest-configuration)

## Extend Webpack Configuration

In kyt.config.js, the [`modifyWebpackConfig`](/docs/kytConfig#modifyWebpackConfig) function is called any time a Webpack config is used.

It's called with two parameters:
1. baseConfig: The current Webpack config
2. options: an object of useful data for editing configuration
  * environment: The environment the Webpack file will be used for [production, development, test, prototype]
  * type: The type of config [client, server, test, prototype]

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
    'myAliasFolder': require('path').resolve(process.cwd(), './src/path/to/my/folder'),
  }
  return baseConfig;
}
```

## Add PostCSS Plugins

You can find the basic PostCSS configuration that kyt applies [here](/packages/kyt-core/config/postcss.config.js). To apply your own PostCSS configuration, add a postcss.config.js file to the root of your project with a custom configuration. Check out the [postcss.config.js documentation](https://github.com/postcss/postcss-loader#config) for more.

## Add Babel Plugins and Presets

As of v0.4.0, kyt respects user `.babelrc` files.

```bash
npm i --save-dev my-babel-plugin
```

in `.babelrc`
```json
{
  "presets": ["kyt-core"],
  "plugins": ["my-babel-plugin"]
}
```
Check out the current [Babel configuration](/.babelrc).

## Add always-mocked modules to Jest configuration

in `kyt.config.js`
```javascript
modifyJestConfig: (baseConfig) => {
  const jestConfig = Object.assign({}, baseConfig);

  // always mock Relay (react-relay) for tests
  jestConfig.moduleNameMapper = Object.assign({}, jestConfig.moduleNameMapper,
    {
      'react-relay': require('path').resolve(__dirname, '__mocks__/react-relay.js'),
    }
  );

  return jestConfig;
}
```

## Editor Configuration

A kyt app should work with any editor but we recommend that you install and configure one of the following editors to work best with kyt's linters:

### Atom

1. go to atom preferences > `Install`
1. Install `linter`
1. Install `linter-eslint`
1. Install `prettier-atom` - in the prettier atom Settings, check the `ESLint Integration` checkbox.
1. Install `linter-stylelint`
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
