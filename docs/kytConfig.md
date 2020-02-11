# kyt.config.js

kyt uses a simple config file in the root of your repo for specifying different options.

To set up your config, create a `kyt.config.js` file in the root of your project,
and export an object with the following options.

**NOTE** kyt.config.js is not currently transpiled with babel. It supports the same syntax as node 6+.

## kyt.config.js options

1.  `serverURL` - url for the backend node server. _default_: http://localhost:3000. if `hasServer` is set to `false`, then this value is ignored
1.  `clientURL` - in development, the url for the client assets server _default_: http://localhost:3001
1.  `debug` - when true, the CLI returns all verbose output _default_: false
1.  `productionPublicPath` - the public path for assets in the production build. Useful for CDN's _default_: `/`
1.  `hasClient` - Use a client client server for dev (useful if you are using Node to generate HTML pages which are not isomorphic) _default_: `true`
1.  `hasServer` - Use a backend node server for build and dev (useful to `false` this out if you already have a backend) _default_: `true`
1.  `modifyWebpackConfig` - Callback function for editing kyt's Webpack configs. [See more details below](#modifyWebpackConfig).

## modifyWebpackConfig

_In an attempt to gather feedback to set future priorities, we're running a brief user survey asking: [what are you using `modifyWebpackConfig` for?](https://github.com/NYTimes/kyt/issues/432)_

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
};
```

> **NOTE:** Polyfills are included in the Webpack configs' `entry.main[]` array by default. If you use `modifyWebpackConfig()` to modify `entry.main[]` and you wish to keep using the provided polyfills, be sure to add the new main entries _after_ the polyfill.

Dev Tip:
[webpack-merge](https://github.com/survivejs/webpack-merge) is a helpful tool for changing and combining Webpack configs.

## Creating env specific kyt configs

kyt allows developers to specify a different kyt config in `dev` and `build` commands for the purpose of creating environment specific configurations.

```
kyt build -C kyt.stage.js
```

option `-C` or `--config` takes a configuration path from the root of your project.
