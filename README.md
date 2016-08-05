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
 5. modifyWebpackConfig - the callback function that allows you to edit webpack configs. see below
 
#### modifyWebpackConfig 
 
 

## Starter kyts

## Prototyping with kyt
 

 

