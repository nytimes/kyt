# kyt recipes
Easy ways to extend kyt

## Use Options in `modifyWebpackConfig`

The `modifyWebpackConfig` function is called any time a Webpack config is used.
It's called with two parameters:
1. baseConfig: The current webpack config
2. options: an object of useful data for editing configuration
  * envrionment: The envrionment the webpack file will be used for [production, development, test, prototype]
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
    'myAliasFolder': path.resolve(process.cwd(), './src/path/to/my/folder'),
  }
  return baseConfig;
}
```

## Add PostCSS Plugins
in `kyt.config.js`
```javascript   
modifyWebpackConfig: (baseConfig, options) => {

  baseConfig.postcss.push(
    require('precss')()
  );

  return baseConfig;
}
```    

## Add Babel Plugins and Presets
in kyt.config.js
```javascript
modifyWebpackConfig: (baseConfig, options) => {

  const babelLoader = baseConfig.module.loaders.find(loader => loader.loader === 'babel-loader');
  babelLoader.query.plugins.push(path.resolve('./path/to/my/plugin'));

  return baseConfig;
}
```
Check out the current [Babel configuration](/.babelrc).
