# kyt Recipes

Easy ways to extend kyt.

## Table of Contents

  1. [Extend Webpack Configuration](#extend-webpack-configuration)
  1. [Add Webpack Aliases](#add-webpack-aliases)
  1. [Add PostCSS Plugins](#add-postcss-plugins)
  1. [Add Babel Plugins and Presets](#add-babel-plugins-and-presets)
  1. [Add always-mocked modules to Jest configuration](add-always-mocked-modules-to-jest-configuration)

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
modifyWebpackConfig: (baseConfig, options, webpack) => {
  baseConfig.resolve.alias = {
    'myAliasFolder': path.resolve(process.cwd(), './src/path/to/my/folder'),
  }
  return baseConfig;
}
```

## Add PostCSS Plugins

in `kyt.config.js`
```javascript   
modifyWebpackConfig: (baseConfig, options, webpack) => {

  baseConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [require('postcss-cssnext')],
        context: '/',
      },
    })
  );

  return baseConfig;
}
```    

## Update browser list for autoprefixer
```javascript
modifyWebpackConfig: (baseConfig, options, webpack) => {
  baseConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer({ browsers: ['last 2 versions', 'ios 8'] })],
        context: '/',
      },
    })
  );
  return baseConfig;
}
```

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
      'react-relay': path.resolve(__dirname, '__mocks__/react-relay.js'),
    }
  );

  return jestConfig;
}
```
