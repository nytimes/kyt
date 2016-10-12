# kyt.config.js

kyt uses a simple config file in the root of your repo for specifying different options.

To set up your config, create a `kyt.config.js` file in the root of your project,
and export an object with the following options.

**NOTE** kyt.config.js is not currently transpiled with babel. It supports the same syntax as node 6+.

## kyt.config.js options

 1. `serverURL` - url for the backend node server. *default*: http://localhost:3000. if `hasServer` is set to `false`, then this value is ignored
 2. `clientURL` - in development, the url for the client assets server *default*: http://localhost:3001
 3. `prototypeURL` - url for the prototyping dev server *default*: http://localhost:3002
 4. `debug` - when true, the CLI returns all verbose output *default*: false
 5. `productionPublicPath` - the public path for assets in the production build. Useful for CDN's *default*: `/assets/`
 6. `reactHotLoader` - Turns on React Hot Loading *default*: false
 7. `hasServer` - Use a backend node server for build and dev (useful to false this out if you already have a backend) *default*: true
 8. `modifyWebpackConfig` - Callback function for editing kyt's Webpack configs. [See more details below](#modifyWebpackConfig).
 9. `modifyJestConfig` - Callback function for editing kyt's Jest config. [See more details below](#modifyJestConfig).


## modifyWebpackConfig
`modifyWebpackConfig` is an optional callback you can define to edit the Webpack config for each part of development.
This allows you to add new babel-plugins, modify Webpack loaders, etc.

The function is called with two parameters:
1. `baseConfig` The base Webpack config used in the process.
2. `options` an object of useful options including the webpackConfig type, ports, and paths. The options object includes an environment and type so you can make changes based on a particular development task.

Define the function in your `kyt.config.js` and it will be called as each Webpack file loads.

```javascript
modifyWebpackConfig: (baseConfig, options) => {
  // modify baseConfig based on the options
  return baseConfig;
}
```

Dev Tip:
[webpack-merge](https://github.com/survivejs/webpack-merge) is a helpful tool for changing and combining Webpack configs.

## modifyJestConfig
`modifyJestConfig` is an optional callback you can define to edit the Jest config for your tests.

The function is called with one parameter:

- `baseConfig` The base Jest config that will be used.


```javascript
modifyJestConfig: (baseConfig) => {
  // modify baseConfig as needed
  return baseConfig;
}
```

> **NOTE:** Currently the base Jest config runs `modifyWebpackConfig()` for you with `options.environment = "development"` in order to grab the development settings for your app (babel plugins, aliases, etc). See the [Jest config recipe](/docs/Recipes.md) for an example use case.

**Dev Tip:**
In some cases you may notice that your Jest configuration doesn't seem to have an affect, this is because Jest has a built-in cache to speed up subsequent test runs. In order to ensure that your configuration changes are reflected, run your tests with the [--no-cache flag](http://facebook.github.io/jest/docs/troubleshooting.html#caching-issues) passed into Jest, like so:

```
kyt test -- --no-cache
```

## Creating env specific kyt configs
kyt allows developers to specify a different kyt config in `dev` and `build` commands for the purpose of creating environment specific configurations.
```
kyt build -C kyt.stage.js
```
option `-C` or `--config` takes a configuration path from the root of your project.
