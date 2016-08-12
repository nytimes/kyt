# kyt
A development kit for Node Apps

## What is kyt?
kyt is a dev tool created to let teams build node apps without having to spend hours messing with configuration.


## How it Works

kyt uses webpack and babel to manage a dev and production build for node apps. It [supports](//link tk) popular libaries including react and css-modules. 

For advanced use cases, kyt enables developers to add additional tools and configuration.
See our [config override instructions](//link tk) for details.


## Quick Start

1. Create a package.json with your kyt dependency.
```
 {
   "name": "my-app",
   "version": "0.0.0",
   "dependencies": {
     "kyt": "git+git@github.com:nytm/wf-kyt.git"
   }
 }
```
2. Run `npm install`
3. Run `node_modules/.bin/kyt setup`
4. Run `npm run dev`
5. Check http://localhost:3000


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

See our [CLI docs](//link tk) for further details.


## Configuration

kyt allows you to specify options in a kyt.config file.
See [here](//link tk) for instructions.

kyt uses webpack to compile project code and run tests.
See the list of supported functionality [here](//link tk)

## starter-kyts

kyt provides all the basic functions for doing development. It can easily be used on it's own, or be intergrated into existing projects. 

starter-kyts are boilerplates built to work alongside kyt. 
They include more additional tools and libraries for a variety of projects.

See our recommended list of [starter-kyts](//link TK) 


### How to build a starter

Community supported starter-kyts can be built to support a variety of projects. 
See additional info [here](// link TK)


## How to contribute to kyt

There are two ways to contribute to kyt:

1. Contribute to open issues

   We're looking for developers to help maintain kyt. 
   See something you think we should address? Open an issue.

2. Build a starter kyt

  Have a great idea for a boilerplate? Build it on top of kyt and let us know about it. 
  We feature [recommended starter-kyts](//link TK)


## Need Help?

1. Check our [FAQ](//link TK)
2. Submit an issue 
