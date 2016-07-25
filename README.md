# KYT
A Starter Kit for React Apps

## What is KYT
KYT is a tool created to let teams build simple react apps without having to manage any configuration. It uses all the tools recommended by Web Frameworks.

## Setup

Setup is completed with Three Easy Steps

### 1. Package.json

Your app will need an example.json file that looks like this

```javascript
{
  "name": "my example app",
  "version": "0.0.0",
  "scripts": {
    "start": "kyt start",
    "lint": "kyt lint",
    "test": "kyt test",
  },
  "devDependencies": {
    "kyt": "git+git@github.com:nytm/wf-magic-starter-kit.git"
  }
}
```
Run `npm install` and if you see the `kyt` repo in your node_modules then you have successfully completed this step.

### 2. Init

Generate an `.editorconfig`, `.babelrc` and `src` directory with the init command:

```
node_modules/.bin/kyt init
```

###  3. Start your app

Use the package.json `scripts` definition above to define `start` and other useful KYT commands to run - `npm run start`.

The command has three options

`--config` This is where you would specify the path to your custom webpack config. The path should be relative to the root of your app.

`--port` The port you want to run your app on. This is a mandatory field

`--print-config` This optional flag prints out the webpack config for easy debugging.

## CLI

More commands and some of their documentation live under the help flag:

```
node_modules/.bin/kyt --help

# or, to see options for a given command:

node_modules/.bin/kyt lint --help
```


## Base Configuration

This tool uses webpackDevServer to serve your app.
There a few assumptions built into the base webpack config. All of these can be overridden.

## Custom Configurations

The magic starter kit tool provides a base webpack config that runs a webpack dev server and includes loaders for all of our supported tools. If you would like to experiement with a new setup or extend with new tools you can create a custom webpack config that will be merged with the base provided.

If you would like to read more about webpack configs see here.

If you would like to read more about webpack smart merge see here.
x

## Tools List

The Web Framework team recommends a suite of tools for React Apps. All of these tools are included in KYT.

### React
We currently support [React](https://facebook.github.io/react/docs/getting-started.html) Version 15 as well as React Dom.

### Babel
[Babel](https://babeljs.io/) is a tool that allows users to use new Javascript features and traspile them for browsers. You can create your own .babelrc file in the root of your app to create your own list of presets.

### JSS
[JSS](https://github.com/jsstyles/jss)
[react-jss](https://github.com/jsstyles/react-jss)

### URL Loader
The [url loader](https://github.com/webpack/url-loader) is a tool for including urls in CSS.


### Linters
