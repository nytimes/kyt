# kyt
A development kit for Node-React Apps

## What is kyt?
kyt is a dev tool created to let teams build node-react apps without having to manage any configuration.

## Setup

### Requirements

There are 2 basic requirements:

1. A `package.json`. 

Your package Json must include kyt as a dependency. You shouldn't need any other dependencies to get started.

Example: 
```
{
  "name": "my-app",
  "version": "0.0.0",
  "devDependencies": {
    "kyt": "git+git@github.com:nytm/wf-kyt.git"
  }
}
```
2. Node v6 is required.

You can install/manage versions of node using [nvm](https://github.com/creationix/nvm):

```
nvm install 6
```

Or, if you already have it

```
nvm use 6
```

### Install kyt

```
npm install -S git+git@github.com:nytm/wf-kyt.git
```

### postinstall kyt init

Kyt uses a postinstall script to initalize the base of your new app.

After you run npm install you will see a few things in the root of your repo:
 1. .babelrc - This file has been symlinked for easy use when scripting
 2. .editorconfig - Also symlinked for easy development with the linter
 3. kyt.config.js - The config file for kyt. 
 
## CLI
kyt includes a CLI with all the basic commands needed for development.
The commands are included in your package.json during install.

1. `kyt dev` starts up a wepack dev server
2. `kyt build` compiles server and client code for production use
3. `kyt run` runs production code
4. `kyt test` runs ava on all tests in /src
5. `kyt proto` starts the prototyping app.
6. `kyt lint` lints src code using eslint
7. `kyt help` Shows commands and their documentation. 
 
### kyt.config.js
kyt includes a base config file in the root of your repo that allows you set a few options for your dev environment
 1. serverPort - port for the node server
 2. clientPort - port for the client assets server
 3. prototypePort - port for the prototyping dev server
 4. debug - when true, the cli returns all verbose output
 5. eslintFile - a path to a new eslintFile, to override kyt's default
 6. modifyWebpackConfig - the callback function that allows you to edit webpack configs.
 
#### modifyWebpackConfig 
 modify webpack config is an optional callback you can define to edit the webpack config for each part of development.
 The function is called with two parameters:
 1. `baseConfig` The base webpack config used in the process
 2. `options` an object of useful options including the webpackConfig type, ports, and paths


 
## Starter kyts

## kyt Commands Explained 

### kyt dev
The `dev` command takes the entry index.js in client and server, compiles them, and starts up a webpack dev server on the specified ports. The dev server includes a react hot loader to allow for faster development. 
You can change ports in the kyt config.

### kyt build
The `build` command takes the entry index.js in client and server, compiles them, and saves them to a build folder. This is a production build and includes minification and tree shaking (with webpack 2). 

### kyt run
The `run` command takes the copiled code from the production build and runs a node server at the specified port. 
You can change ports in the kyt config.

### kyt test
The `test` command takes any test files in your src directory and runs them using Ava. 

### kyt lint
The `lint` command lints all files in the src directory using eslint. 
You can override the base eslint file in the kyt config.

### kyt proto
The `proto` command starts up a webpack dev server for building quick prototypes with react components. 

To use the prototype, you must include a `prototype.js` in the root of your repo that exports the root react component for your prototype. Then run `npm run proto` and you will see your component at the specified url.
You can change the prototype port in the kyt config.
 
## kyt Tools List
kyt has chosen several key dependencies for development. 
 
### Webpack 
 
### React

### Ava

### Chai

### Enzyme

