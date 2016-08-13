# kyt
A development kit for Node Apps

## What is kyt?
kyt is a dev tool created to let teams build node apps without having to spend hours messing with configuration.


## How it Works

kyt uses webpack and babel to manage a dev and production build for node apps. It [supports](https://github.com/nytm/wf-kyt/config/webpackConfig.md) popular libaries including React and css-modules. 

For advanced use cases, kyt enables developers to add additional tools and configuration.
See our [config override instructions](https://github.com/nytm/wf-kyt/config/kytConfig.md) for details.


## Quick Start

1. Create a package.json
```
 {
   "name": "my-app",
   "version": "0.0.0",
   "dependencies": {
     "kyt": "git+git@github.com:nytm/wf-kyt.git"
   }
 }
```
2. `npm install`
3. `node_modules/.bin/kyt setup`
4. `npm run dev`
5. http://localhost:3000


## Requirements

1. Node v6 is required.

That's it.

## Installation
There are two ways to install kyt.

### Global Install

```
npm install kyt -g
``` 

With global install you can use kyt commands in any repo.

### Install as a dependency

1. create a repo with a package.json file
2. `npm install --save git@github.com:nytm/wf-kyt.git`

## CLI

kyt includes a CLI with all the basic commands needed for development.

`kyt dev` starts up a wepack dev server
`kyt build` compiles server and client code for production use
`kyt run` runs production code
`kyt test` runs ava on all tests in /src
`kyt proto` starts the prototyping app.
`kyt lint` lints src code using eslint
`kyt help` Shows commands and their documentation.
`kyt setup` sets up kyt and installs a specified starter kyt

See our [CLI docs](https://github.com/nytm/wf-kyt/cli) for further details.

## Conventions
kyt follows several conventions for directory structure. If you're setting up a new project, see details [here](https://github.com/nytm/wf-kyt/conventions.md). 


## Configuration

kyt allows you to specify options in a kyt.config file.
See [here](https://github.com/nytm/wf-kyt/kytConfig.md) for instructions.

kyt uses webpack to compile project code and run tests.
See the list of supported functionality [here](https://github.com/nytm/wf-kyt/config/webpackConfig.md)

## starter-kyts

kyt provides all the basic functions for doing development. It can easily be used on it's own, or be integrated into existing projects. 

starter-kyts are boilerplates built to work alongside kyt. 
They include more additional tools and libraries for a variety of projects.

See our recommended list of [starter-kyts](https://github.com/nytm/wf-kyt/Starterkyts.md) 


### How to build a starter

Community supported starter-kyts can be built to support a variety of projects. 
See additional info [here](https://github.com/nytm/wf-kyt/Starterkyts.md)


## How to contribute to kyt

There are two ways to contribute to kyt:

1. Contribute to open issues

   We're looking for developers to help maintain kyt. 
   See something you think we should address? Open an issue.

2. Build a starter kyt

  Have a great idea for a boilerplate? Build it on top of kyt and let us know about it. 
  We feature [recommended starter-kyts](https://github.com/nytm/wf-kyt/Starterkyts.md)


## Need Help?

1. Check our [FAQ](https://github.com/nytm/wf-kyt/FAQ.md)
2. Submit an issue 
