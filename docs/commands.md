# kyt command line interface

kyt includes a CLI with all the commands needed for development.

`kyt-cli setup` includes these commands as scripts in your package.json:

```
npm run dev
```

Or you can run a command with `npx kyt command`

```
npx kyt build
```

1. [starter-kyt](/docs/Starterkyts.md)
2. [`dev`](/docs/commands.md#dev) starts up a development environment
3. [`build`](/docs/commands.md#build) compiles server and client code for production use
4. [`proto`](/docs/commands.md#proto) starts the prototyping app
5. `--help` shows commands and their documentation

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
prototypeURL: "http://localhost:3002/prototype"
```

### Updating the prototype Webpack config

You can update the prototype config by using the modifyWebpackConfig function in `kyt.config.js`.
See [modifyWebpackConfig](/docs/kytConfig.md#modifywebpackconfig) instructions.
