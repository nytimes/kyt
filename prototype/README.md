# prototyping with kyt

kyt provides a scratch space for building simple prototypes alongside your app. 
To get started, follow the setup instructions below.

## How Prototype Works

1. Create a `prototype.js` file. 

The proto command takes a `prototype.js` file at the root of your repo as an entry for a wepack dev server. 
You can use this file as the start of your prototype. 

2. index.html

The proto command also provides an index.html file with the following content:
```
<div id="root"></div>
<script src="/prototype/bundle.js"></script>
```

`/prototype/bundle.js` loads the JavaScript built by Webpack.


## The proto command

Running `proto` starts a Webpack dev server at the port specified in your `kyt.config.js`

```
✅  webpack-dev-server http://localhost:3002/prototype
```

## Updating the prototype Webpack config
You can update the prototype webpack config by using the modifyWebpackConfig function in `kyt.config.js`.
See [modifyWebpackConfig](/config/kytConfig.md#modifywebpackconfig) instructions.


