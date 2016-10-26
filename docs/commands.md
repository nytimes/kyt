# kyt command line interface

kyt includes a CLI with all the commands needed for development.

`setup` includes these commands as scripts in your package.json:
```
npm run dev
```
Or you can run a command with `node_modules/.bin/kyt command`
```
node_modules/.bin/kyt build
```

1. `setup` sets up kyt and installs a specified [starter-kyt](/docs/Starterkyts.md)
2. `dev` starts up a development environment
3. `build` compiles server and client code for production use
4. `start` runs the production server
5. `test` runs all tests in /src
6. `proto` starts the prototyping app
7. `lint` lints src code using ESLint
8. `lint-style` lints src code using StyleLint
9. `help` shows commands and their documentation

## setup

The `setup` command sets up your project with all the application files that you'll need to use kyt.

1. Creates a new [kyt.config.js](/docs/kytConfig.md)
2. Creates a .gitignore and .editorconfig
3. Creates linter configurations -  .eslintrc.json and .stylelintrc.json files
4. Adds kyt commands to npm scripts

If kyt finds any files with duplicate names, it will back up your file before replacing it.

### setup with a starter-kyt

`setup` also allows you to plug a starter-kyt into your app.

Running `kyt setup` will give you the option to install the [default starter-kyt.](https://github.com/NYTimes/kyt-starter-universal)

You can also pass the `-r` flag with any starter-kyt git clone URL:

```
 kyt setup -r git@github.com:nytimes/kyt-starter.git
```

`setup` will then:

1. Copy configuration and src files into your project
2. Install necessary npm packages
3. Copy lint configurations into your project
4. Add kyt commands to your npm scripts

### Recommended starter-kyts

#### [Universal React starter-kyt](https://github.com/NYTimes/kyt-starter-universal)
This default starter-kyt is a good base for building advanced, universal React apps.

```
node_modules/.bin/kyt setup
```

#### [Static starter-kyt](https://github.com/NYTimes/kyt-starter-static)

This starter-kyt is for creating client side React apps.
Install by running:
```
node_modules/.bin/kyt setup -r git@github.com:nytimes/kyt-starter-static.git
```

#### [Universal Angular2 starter-kyt](https://github.com/delambo/kyt-starter-universal-angular2)
Still a work in progress, but this starter-kyt will serve as the base for building advanced, universal Angular2 apps.

```
node_modules/.bin/kyt setup -r git@github.com:delambo/kyt-starter-universal-angular2.git
```

## dev

The `dev` command takes the entry index.js in `src/client/` and `src/server/`, compiles them, and starts client and backend servers. The dev environment includes hot reloading to allow for fast development.

If `hasServer` is set to `false` in [kyt.config.js](/docs/kytConfig.md), `src/server/` is ignored and no backend server is started.

Optionally, you can configure urls for the development servers in the [kyt config](/docs/kytConfig.md).

You can pass flags to the node server through `kyt dev`.
For example:
```
kyt dev -- --inspect
```
will run the [node debugging for Chrome DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27#.mpuwgy17v)

## build

The `build` command takes the entry index.js in `src/client/` and `src/server/` (ignoring the latter if `hasServer` set to false in [kyt.config.js](/docs/kytConfig.md)), compiles them, and saves them to a build folder. This is an optimized production build.

The build command will also copy the `src/public` directory for static assets.

`build` uses option `-C`(`--config`) to denote a path to a different [kyt.config.js](/docs/kytConfig.md) file

## start

The `start` command takes the compiled code from the production build and runs a node server at the specified port. `start` will log an error and exit if `hasServer` is set to `false` in your [kyt.config.js](/docs/kytConfig.md).

Optionally, you can configure the server url in your [kyt.config.js](/docs/kytConfig.md).

You can also pass flags to node through `kyt start`:
```
kyt start -- --no-warnings
```

## test

The `test` command takes test files in your `src/` directory and runs them using [Jest](http://facebook.github.io/jest/).
kyt test looks for any `*.test.js` files in `src/`.

You can pass flags to jest through `kyt test`.
```
kyt test -- --no-cache
```

### test-watch

Runs Jest with `--watch`.

### test-coverage

Runs Jest with `--coverage`.

### Updating the Jest config

You can update the Jest configuration by defining a `modifyJestConfig` function in your `kyt.config.js`.
See [modifyJestConfig](/docs/kytConfig.md#modifyJestConfig) instructions.

## lint

The `lint` command lints all files in the `src/` directory using ESLint.
During `setup`, an `.eslintrc.json` file is copied into the root of your app which extends kyt's base configuration.
You can add or update any rules in this file.

kyt's base ESLint config extends [Airbnb](https://github.com/airbnb/javascript) with a few overrides. You can find kyt's base ESLint configuration [here](/config/.eslintrc.json).

Flags can be passed to ESLint through `kyt lint`

```
kyt lint -- --fix
```

## lint-style

The `lint-style` command uses Stylelint to lint all files in the `src/` directory. By convention, it looks for files with a `.css` or `.scss` extension.
During `setup`, a `.stylelintrc.json` is copied into the root of your app that extends kyt's base configuration, pre-configured with [config-standard](https://github.com/stylelint/stylelint-config-standard) with some overrides for CSS/Sass Modules. You can find kyt's base Stylelint configuration [here](/config/.stylelintrc.json). You can add or update any of the [Stylelint rules](http://stylelint.io/user-guide/rules/) in your `.stylelintrc.json`.

## proto

kyt provides a scratch space for building simple prototypes alongside your app.
To get started, follow the setup instructions below.

### How Prototype Works

1. Create a `prototype.js` file.

The proto command takes a `prototype.js` file at the root of your app as an entry for a dev server. You can use this file as the start of your prototype.

2. index.html

The proto command also provides an `index.html` file with the following content:
```
<div id="root"></div>
<script src="/prototype/bundle.js"></script>
```

`/prototype/bundle.js` loads the JavaScript assets.


### The proto command

Running `proto` starts a dev server. Optionally, you can configure the prototype server url in your [kyt.config.js](/docs/kytConfig.md).

```
✅  webpack-dev-server http://localhost:3002/prototype
```

### Updating the prototype Webpack config

You can update the prototype config by using the modifyWebpackConfig function in `kyt.config.js`.
See [modifyWebpackConfig](/docs/kytConfig.md#modifywebpackconfig) instructions.
