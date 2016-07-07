# magic-starter-kit
A Starter Kit for React Apps

## What is Magic Starter Kit
Magic Starter Kit is a tool created to let teams build simple react apps without having to manage any tools. It uses all the tools recommended by Web Frameworks.

## Setup

Setup is completed with Three Easy Steps

### 1 Package.json

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

### 2 Babelrc
Because we are using babel, you must include a `.babelrc` file. You can copy ours from the repo or create your own. It should be placed at the root directory.

###  3 Run the starter Kit
In the scripts section of the `package.json` above you will see the startup command `start-magic`

The command has three options

`--config` This is where you would specify the path to your custom webpack config. The path should be relative to the root of your app.

`--port` The port you want to run your app on. This is a mandatory field

`--print-config` This optional flag prints out the webpack config for easy debugging.

## Custom Configurations

The magic starter kit tool provides a base webpack config that runs a webpack dev server and includes loaders for all of our supported tools. If you would like to experiement with a new setup or extend with new tools you can create a custom webpack config that will be merged with the base provided.

If you would like to read more about webpack configs see here.

If you would like to read more about webpack smart merge see here.

## Tool List

The Web Framework team recommends a suite of tools for React Apps. All of these tools are included in the magic starter kit.


### React

### CSS Modules

### Linters
