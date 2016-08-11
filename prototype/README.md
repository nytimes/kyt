# Prototyping with kyt

kyt provides a scratch space for building simple prototypes alongside your app. 
To get started, follow the setup instructions below.

## How Prototype Works

1. Create a `prototype.js` file. 

The proto command takes a `prototype.js` file at the root of your repo as an entry for a wepack dev server. 
You can use this file as the root of your prototype. 

2. index.html


The proto command also provides an index.html file with the following content
```
<div id="root"></div>
<script src="/prototype/bundle.js"></script>
```

/prototype/bundle.js loads the js built by webpack


## The kyt proto command

Running kyt proto starts a webpack dev server at the port specified in your kyt.config

```
✅  webpack-dev-server http://localhost:3002/prototype
```


## Updating the prototype webpack config
You can update the prototype webpack config by using the modifyWebpackConfig function in kyt.config.js.
See modifyWebpackConfig instructions here. 


