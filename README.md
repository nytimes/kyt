# KYT
A Starter Kit for React Apps

## What is KYT
KYT is a tool created to let teams build simple react apps without having to manage any configuration. It uses all the tools recommended by Web Frameworks.

## Setup

Setup is completed with Two Easy Steps

### 1. Package.json

Your app will need an example.json file that looks like this

```javascript
{
  "name": "my example app",
  "version": "0.0.0",
  "devDependencies": {
    "kyt": "git+git@github.com:nytm/wf-magic-starter-kit.git"
  }
}
```
Run `npm install` and if you see the `kyt` repo in your node_modules then you have successfully completed this step.

#### Init

Kyt uses a postinstall script to initalize the base of your new app.

After you run npm install you will see a few things in the root of your repo:

1. `.babelrc` kyt symlinks a babelrc file so you can write the latest JS.
2. `.editorconfig` symlinked to set up some basic editor conventions.
3. `/src` kyt creates src directory with a few files to help you get started.
  * *client.js* For your frontend code
  * *server.js* A basic express server setup with webpack
  * *index.html* To serve your app with the webpack bundle
  * */components* The components directory includes an example of a react component using JSS as well as a test written with Ava, chai and enzyme.

###  3. Start your app

Use the package.json `scripts` definition above to define `start` and other useful KYT commands to run - `npm run start`.

The command has three options

`--config` This is where you would specify the path to your custom webpack config. The path should be relative to the root of your app.

`--port` The port you want to run your app on. This is a mandatory field

`--print-config` This optional flag prints out the webpack config for easy debugging.

## CLI

During initialization kyt includes all of its commands in your package.json

1. `kyt:start` starts up a wepack dev server
2. `kyt:init` initializes files in the root of your repo
3. `kyt:test` runs ava on all tests in /src
4. `kyt:lint` lints src code using eslint
5. `kyt:update` updates the configurations and files that have been copied into your rood directory
6. `kyt:help` Shows commands and their documentation. You can also see options for any command by adding the --help flag.


## Updating kyt
When you run npm install, kyt will also make any new changes to its configurations, add new commands, and update its examples. 
You can also manually update by running: 
``` 
npm run kyt:update
```


## Base Configuration

This tool uses webpackDevServer to serve your app.
There a few assumptions built into the base webpack config. All of these can be overridden.

## Custom Configurations

kyt provides a base webpack config that runs a webpack dev server and includes loaders for all of our supported tools. If you would like to experiement with a new setup or extend with new tools you can create a custom webpack config that will be merged with the base provided.

Read more about [webpack configs](http://webpack.github.io/docs/examples.html)

Read more about [webpack-merge](https://www.npmjs.com/package/webpack-merge)


## kyt utils
kyt provides a set of utils to help extend your app.

1. useReactJSS creates react-jss useSheet to be used in your react components. See the TestComponent for an example

## Tools List

The Web Framework team recommends a suite of tools for building React Apps. All of these tools are included in kyt.

### React
We currently support [React](https://facebook.github.io/react/docs/getting-started.html) Version 15 as well as React Dom.

### Babel
[Babel](https://babeljs.io/) is a tool that allows users to use new Javascript features and traspile them for browsers. You can create your own .babelrc file in the root of your app to create your own list of presets.

### JSS
[JSS](https://github.com/jsstyles/jss)
[react-jss](https://github.com/jsstyles/react-jss)

### URL Loader
The [url loader](https://github.com/webpack/url-loader) is a tool for including urls in CSS.

### Express


### Linters


### Testing

#### AVA 
Kyt runs unit tests using the [Ava test runner](https://github.com/avajs/ava#test-syntax)

#### Chai
Kyt includes the [Chai assertion libary](http://chaijs.com/api/)

#### Enzyme
Kyt includes [Enzyme](https://github.com/airbnb/enzyme/blob/master/README.md) for unit testing react components. 

#### JSDOM
Kyt includes [JSDOM](https://github.com/tmpvar/jsdom) when using Ava to allow for easy testing when building components with JSS. JSDOM loads atomatically when running tests in kyt so there is no setup.
