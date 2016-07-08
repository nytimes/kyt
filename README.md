# magic-starter-kit
A Starter Kit for React Apps

## What is Magic Starter Kit
Magic Starter Kit is a tool created to let teams build simple react apps without having to manage any tools. It uses all the tools recommended by Web Frameworks.

## Setup

Setup is completed with Three Easy Steps

### 1. Package.json

Your app will need an example.json file that looks like this

```javascript
{
  "name": "my example app",
  "version": "0.0.0",
  "scripts": {
    "start": "start-magic --config './config/config.js' --port 1339"
  },
  "devDependencies": {
    "magic-starter-kit": "git+git@github.com:nytm/wf-magic-starter-kit.git"
  }
}
```
Run `npm install` and if you see the `wf-magic-starter-kit` repo in your node modules then you have successfully completed this step.

### 2. Babelrc
Because we are using babel, you must include a `.babelrc` file. You can copy ours from the repo or create your own. It should be placed at the root directory.

###  3. Run the starter Kit
In the scripts section of the `package.json` above you will see the startup command `start-magic`

The command has three options

`--config` This is where you would specify the path to your custom webpack config. The path should be relative to the root of your app.

`--port` The port you want to run your app on. This is a mandatory field

`--print-config` This optional flag prints out the webpack config for easy debugging.


## Base Configuration

This tool uses webpackDevServer to serve your app.
There a few assumptions built into the base webpack config. All of these can be overridden.

### Entry at ./src/index.js

The base configuration requires that your starting file be included in a /src folder.

### index.html

In order to server the page you will also have to create an `index.html` file in the `/src` folder. Here is an example of that file

```html
<div id="root"></div>
<script src="/bundle.js"></script>
```
Your index.js file can then hook into root to run your react app.


## Custom Configurations

The magic starter kit tool provides a base webpack config that runs a webpack dev server and includes loaders for all of our supported tools. If you would like to experiement with a new setup or extend with new tools you can create a custom webpack config that will be merged with the base provided.

If you would like to read more about webpack configs see here.

If you would like to read more about webpack smart merge see here.
x

## Tool List

The Web Framework team recommends a suite of tools for React Apps. All of these tools are included in the magic starter kit.


### React
We currently support [React](https://facebook.github.io/react/docs/getting-started.html) Version 15 as well as React Dom.


### Babel
[Babel](https://babeljs.io/) is a tool that allows users to use new Javascript features and traspile them for browsers. You can create your own .babelrc file in the root of your app to create your own list of presets.

### PostCSS
[PostCSS](http://postcss.org/) allows users to transform their CSS with a suite of plugins. We current support two postcss [plugins](http://postcss.parts/)

#### AutoPrefixer
[Autoprefixer](https://github.com/postcss/autoprefixer) adds old browser prefixes to CSS

#### Remify
[Remify](https://github.com/OakMX/postcss-remify) converts pixel font sizes to rems.

### CSS Modules
Css Modules is a webpack css-loader option that allows users to locally scope their styles to each component. More info on CSS Modules [here](https://github.com/css-modules/css-modules)

### URL Loader
The [url loader](https://github.com/webpack/url-loader) is a tool for including urls in CSS.


### Linters
