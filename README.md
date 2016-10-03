<p align="center"><img src="/images/kyt-logo-large.png"></p>

# kyt

Every sizable JavaScript web app needs a common foundation: a setup to build, run, test and lint your code.
kyt is a toolkit that encapsulates and manages the configuration for web apps.

Read more about kyt in our [blog post](http://open.blogs.nytimes.com/2016/09/13/introducing-kyt-our-web-app-configuration-toolkit/).

[![Build Status](https://travis-ci.org/NYTimes/kyt.svg?branch=master)](https://travis-ci.org/NYTimes/kyt) [![Dependency Status](https://david-dm.org/NYTimes/kyt.svg)](https://david-dm.org/NYTimes/kyt) [![npm](https://img.shields.io/npm/v/kyt.svg)](https://www.npmjs.com/package/kyt)

## Quick Start

1. Install [Node.js](https://nodejs.org/) (v6.0+ required).
2. Create a directory with a package.json file
3. `npm install --save kyt`
4. `node_modules/.bin/kyt setup` - This will set up your project with application and configuration files so that you can get started with kyt. Learn more about [setup](/docs/commands.md#setup).
5. `npm run dev`
6. Check out `http://localhost:3000`

We recommend installing kyt as a dependency in your project.

## How it Works

kyt manages configuration for all aspects of development. It can be installed as an npm dependency into a new or existing project. kyt’s goal is to encapsulate only development tools, giving users the freedom to control their source directory and make important decisions about app architecture. kyt provides a [command line interface](/docs/commands.md) for running all development tools.

<p align="center"><img src="/images/kyt-diagram.png"></p>

kyt's base features include:

* A Node server provided for rendering front-end page requests
* Client and server hot reloading
* [ES-Latest stable](https://babeljs.io/docs/plugins/preset-latest/) features using Babel.
* CSS Module and SASS support
* Inline SVG support
* Style and script linter rulesets
* A pre-configured test runner with Jest
* Optional client-only mode for apps that already have a server

Developers design their own architecture, choosing the tools they need for rendering, styling, and handling data.

For advanced use cases, kyt enables developers to add additional tools and configuration.
See our [config override instructions](/docs/kytConfig.md#modifywebpackconfig) for details, and our [recipes](/docs/Recipes.md) for examples.

## Command line

kyt includes a command line program with all the commands needed for development.

`setup` includes these commands as scripts in your package.json:

```
npm run dev
```

Or you can run a command using `node_modules/.bin/kyt command`

```
node_modules/.bin/kyt build
```

* [`setup`](/docs/commands.md#setup) sets up kyt and installs a starter-kyt
* [`dev`](/docs/commands.md#dev) starts a development environment
* [`build`](/docs/commands.md#build) compiles server and client code for production use
* [`start`](/docs/commands.md#start) runs production code
* [`test`](/docs/commands.md#test) runs all tests in /src
* [`proto`](/docs/commands.md#proto) starts the prototyping app
* [`lint`](/docs/commands.md#lint) lints src code using ESLint
* [`lint-style`](/docs/commands.md#lint-style) lints src code using Stylelint
* [`help`](/docs/commands.md#help) shows commands and their documentation

See our [CLI docs](/docs/commands.md) for further details.

## Conventions

kyt follows a few simple conventions.

All projects must have the following structure:
```
  src/
    client/
      index.js
    server/
      index.js
```

Each `index.js` file acts as the build entry.

*(Note that `server/index.js` is not required if `hasServer` is `false` in [config](#configuration)).*

If you're setting up a new project our full list of [conventions](/docs/conventions.md).


## Configuration

kyt allows you to specify options in a `kyt.config.js` file.
See the [kyt config docs](/docs/kytConfig.md) for instructions.

kyt uses Webpack to compile src code and run tests.
See our [recipes](/docs/Recipes.md) for extending configuration.

## starter-kyts

While kyt can be easily integrated into new or existing Node projects, it is even more powerful when used with a starter-kyt. A starter-kyt offers the benefits of boilerplates while minimizing the amount of new tools to learn and maintain. The kyt CLI includes a `setup` command which installs any preconfigured starter-kyt git repository, adding additional dependencies and building a source directory.

See our recommended list of [starter-kyts](/docs/commands.md#recommended-starter-kyts)

### How to build a starter-kyt

Community supported starter-kyts can be built to support a variety of projects.
See additional info on [how to build a starter-kyt](/docs/Starterkyts.md).


## How to contribute to kyt

Want to help? See details [here](/CONTRIBUTING.md)

## Need Help?

1. Check our [FAQ](/docs/FAQ.md)
2. Submit an issue
3. Check out our [recipes](/docs/Recipes.md) for extending kyt

## Changelog

[Changelog](/CHANGELOG.md)
