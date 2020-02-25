<p align="center"><img src="/images/kyt-logo-large.png"></p>

# kyt

Every sizable JavaScript web app needs a common foundation: a setup to build, run, test and lint your code. `kyt` is a toolkit that encapsulates and manages the configuration for web apps.

Read more about kyt in our [blog post](http://open.blogs.nytimes.com/2016/09/13/introducing-kyt-our-web-app-configuration-toolkit/).

[![Build Status](https://travis-ci.org/nytimes/kyt.svg?branch=master)](https://travis-ci.org/nytimes/kyt) [![Dependency Status](https://david-dm.org/NYTimes/kyt.svg)](https://david-dm.org/NYTimes/kyt) [![npm](https://img.shields.io/npm/v/kyt.svg)](https://www.npmjs.com/package/kyt)

## Quick Start

1. Install [Node.js](https://nodejs.org/) (v10.0+ required). On Mac, this is as simple as:

```sh
brew install nvm
nvm use
```

1. `npm install --save-dev kyt`
1. `kyt setup` - This will set up your project with application and configuration files so that you can get started with `kyt`. Learn more about [setup](/packages/kyt-core/README.md).
1. `npm run dev`
1. Check out `http://localhost:3000`

## Features

- Optional universal support with a Node server provided for rendering front-end page requests
- Client and server hot reloading
- Custom Babel presets with ES6 support, optional React support and optimizations for polyfilling Node and browser builds.
- Static asset support
- Inline SVG support
- ESLint ruleset
- Jest configuration for ESLint and CSS-in-JS codebases
- Optional client-only mode for apps that already have a server

## How it Works

`kyt` manages configuration for all aspects of development. It can be installed as an npm dependency into a new or existing project. `kyt`’s goal is to encapsulate only development tools, giving users the freedom to control their source directory and make important decisions about app architecture. `kyt` provides a [command line interface](/docs/commands.md) for running all development tools.

<p align="center"><img src="/images/kyt-diagram.png"></p>

Developers design their own architecture, choosing the tools they need for rendering, styling, and handling data.

For advanced use cases, `kyt` enables developers to add additional tools and configuration.
See our [config override instructions](/docs/kytConfig.md#modifywebpackconfig) for details, and our [recipes](/docs/Recipes.md) for examples.

## Setting up a kyt project

`kyt setup` is a utility for bootstrapping `kyt` projects. It can be run to create a new project or integrate `kyt` with an existing project.

See the [kyt](/packages/kyt-core/README.md) documentation for more details.

## Command line

`kyt` includes a command line program with all the commands needed for development.

Running `kyt setup` includes these commands as scripts in your `package.json`:

```
npm run dev
```

Or you can run a command using `npx kyt {command}`:

```
npx kyt build
```

Here are the available commands:

- [`dev`](/docs/commands.md#dev) starts a development environment
- [`build`](/docs/commands.md#build) compiles server and client code for production use
- [`help`](/docs/commands.md#help) shows commands and their documentation

See our [CLI docs](/docs/commands.md) for further details.

## Conventions

`kyt` follows a few simple conventions.

All projects must have the following structure:

```
src/
  client/
    index.js
    polyfills.js
  server/
    index.js
    polyfills.js
```

Each `index.js` file acts as the build entry.

_(Note that `server/index.js` is not required if `hasServer` is `false` in [config](#configuration))._
_(Note that `client/index.js` is not required if `hasClient` is `false` in [config](#configuration))._

If you're setting up a new project see our full list of [conventions](/docs/conventions.md).

## Configuration

`kyt` allows you to specify options in a `kyt.config.js` file.
See the [kyt config docs](/docs/kytConfig.md) for instructions.

`kyt` uses Webpack to compile src code.
See our [recipes](/docs/Recipes.md) for extending configuration.

`kyt` respects Babel config files defined at the root of user projects, and provides [presets](/packages/babel-preset-kyt-react) to provide opinionated configurations. (If no Babel config file is defined in the user project, [`babel-preset-kyt-core`](https://www.npmjs.com/package/babel-preset-kyt-core) is used when compiling Webpack.)

## `starter-kyt`s

While `kyt` can be easily integrated into new or existing Node projects, it is even more powerful when used with a `starter-kyt`. A `starter-kyt` offers the benefits of a boilerplate while minimizing the amount of new tools to learn and maintain.

The `kyt setup` command installs any preconfigured `starter-kyt` git repository, adding additional dependencies and building a source directory.

### How to build a `starter-kyt`

See additional info on [how to build a `starter-kyt`](/docs/Starterkyts.md).

## How to contribute to `kyt`

Want to help? See details [here](/CONTRIBUTING.md)

## Need Help?

1. Check our [FAQ](/docs/FAQ.md)
2. Submit an issue
3. Check out our [recipes](/docs/Recipes.md) for extending kyt

## Changelog

[Changelog](/CHANGELOG.md)
