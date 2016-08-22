# kyt.config.js

kyt uses a simple config file in the root of your repo for specifying different options.

To set up your config, create a `kyt.config.js` file in the root of your project,
and export an object with the following options.

**NOTE** kyt.config.js is not currently transpiled with babel. It supports the same syntax as node 6+.
See the [base kyt config](/config/kyt.base.config.js) for an example.

## kyt.config.js options

 1. `serverPort` - port for the node server *default*: 3000
 2. `clientPort` - port for the client assets server *default*: 3001
 3. `prototypePort` - port for the prototyping dev server *default*: 3002
 4. `debug` - when true, the CLI returns all verbose output *default*: false
 5. `productionPublicPath` - the public path for assets in the production build. Useful for CDN's *default*: `/assets/`
 6. `modifyWebpackConfig` - the callback function that allows you to edit webpack configs. See more details below
 

## ModifyWebpackConfig
modifyWebpackConfig is an optional callback you can define to edit the webpack config for each part of development.
This allows you to add new babel-plugins, modify webpack loaders, etc. 
 
The function is called with two parameters:
1. `baseConfig` The base webpack config used in the process
2. `options` an object of useful options including the webpackConfig type, ports, and paths. The options object includes an environment and type so you can make changes based on a particular development task.
 
Define the function in your `kyt.config.js` and it will be called as each webpack file loads.

```javascript 
  modifyWebpackConfig: (config, options) => {
    // modify config based on the options
    return config;
  }
```

Dev Tip: 
[webpack-merge](https://github.com/survivejs/webpack-merge) is a helpful tool for changing and combining Webpack configs. 
