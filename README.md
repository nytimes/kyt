![logo](/images/kyt-logo-large.png)

# kyt

Web apps written in JavaScript require tools for transpiling, testing, and linting. Typical project setup includes copying configuration boilerplate, managing and updating it over the lifetime of the project.

kyt is a toolkit that encapsulates and manages the configuration for web apps.

## Quick Start

1. Install [Node.js](https://nodejs.org/) (v6.0+ required).
2. Create a repo with a package.json file
3. `npm install --save git://git@github.com:nytm/wf-kyt.git`
4. `node_modules/.bin/kyt setup` - This will set up your project with all things kyt. Learn more about [setup](/docs/commands.md).
5. `npm run dev`
6. Check out `http://localhost:3000`

We recommend installing kyt as a dependency in your project.

Want an in depth look at setting up kyt? Check out our [tutorial](/docs/tutorial.md)

## How it Works

kyt manages configuration for all aspects of development. It can be installed as an npm dependency into a new or existing project. kyt’s goal is to encapsulate only development tools, giving users the freedom to control their source directory and make important decisions about app architecture. kyt provides a [command line tool](/docs/commands.md) for running all development tools.

![diagram](/images/kyt-diagram.png)

kyt is designed with a set of base opinions such as

* A Node server provided for rendering front-end page requests
* Client and server hot reloading
* ES2015 feature syntax
* CSS Module and SASS support
* Style and script linter rulesets
* A pre-configured test runner with Jest

Developers design their own architecture, choosing the tools they need for rendering, styling, and handling data.

For advanced use cases, kyt enables developers to add additional tools and configuration.
See our [config override instructions](/docs/kytConfig.md#modifyWebpackConfig) for details, and our [recipes](/docs/Recipes.md) for examples.

## Command line

kyt includes a command line program with all the commands needed for development.

`setup` includes these commands as scripts in your package.json:

```
npm run dev
```

Or you can run a command with `node_modules/.bin/kyt command`

```
node_modules/.bin/kyt build
```

* `dev` starts a development environment
* `build` compiles server and client code for production use
* `start` runs production code
* `test` runs Jest on all tests in /src
* `proto` starts the prototyping app
* `lint` lints src code using ESLint
* `lint-style` lints src code using Stylelint
* `help` shows commands and their documentation
* `setup` sets up kyt and installs a specified [starter-kyt](/docs/Starterkyts.md)

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
If you're setting up a new project see additional details [here](/docs/conventions.md).


## Configuration

kyt allows you to specify options in a `kyt.config.js` file.
See [here](/docs/kytConfig.md) for instructions.

kyt uses Webpack to compile src code and run tests.
See our [recipes](/docs/Recipes.md) for extending configuration.

## starter-kyts

While kyt can be easily integrated into new or existing Node projects, it is most powerful when used with a [starter-kyt](/docs/Starterkyts.md). A starter-kyt offers the benefits of boilerplates while minimizing the amount of new tools to learn and maintain. The kyt CLI includes a `setup` command, which installs any preconfigured starter-kyt repo, adding additional dependencies and building a source directory.

See our recommended list of [starter-kyts](/docs/Starterkyts.md)

### How to build a starter-kyt

Community supported starter-kyts can be built to support a variety of projects.
See additional info [here](/docs/Starterkyts.md)


## How to contribute to kyt

Want to help? See details [here](/CONTRIBUTING.md)


## Need Help?

1. Check our [FAQ](/docs/FAQ.md)
2. Submit an issue
3. Check out our [recipes](/docs/Recipes.md) for extending kyt
