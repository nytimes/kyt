# kyt Command Line Interface

kyt includes a CLI with all the commands needed for development.
During `setup` the commands are written into your package.json file.
You can also run them with `node_modules/.bin/kyt commandName`

1. `dev` starts up a development environment
2. `build` compiles server and client code for production use
3. `run` runs production code
4. `test` runs AVA on all tests in /src
5. `proto` starts the prototyping app
6. `lint` lints src code using ESLint
7. `lint-style` lints src code using StyleLint
7. `help` shows commands and their documentation
8. `setup` sets up kyt and installs a specified [starter-kyt](/Starterkyts.md)

## kyt commands explained

### dev

The `dev` command takes the entry index.js in `src/client/` and `src/server/`, compiles them, and starts client and backend servers on the specified ports. The dev environment includes hot reloading to allow for fast development.
You can update ports in the [kyt config](/kytConfig.md).

### build

The `build` command takes the entry index.js in `src/client/` and `src/server/`, compiles them, and saves them to a build folder. This is an optimized production build.

The build command will also copy the `src/public` directory for static assets.

`build` uses option `-C`(`--config`) to denote a path to a different [kyt.config.js](/config/kytConfig.md) file

### run

The `run` command takes the compiled code from the production build and runs a node server at the specified port.
You can update ports in the [kyt config](/kytConfig.md).

### test

The `test` command takes test files in your `src/` directory and runs them using [Ava](https://github.com/avajs/ava).
kyt test looks for any `*.test.js` files in `src/`.

### lint

The `lint` command lints all files in the `src/` directory using ESLint.
During `setup`, an `.eslintrc` is copied into the root of your app.
You can add or update any rules in this file.

kyt's ESLint config extends [Airbnb](https://github.com/airbnb/javascript) with a few overrides.

### lint-style

The `lint-style` command uses Stylelint to lint all files in the `src/` directory. By convention, it look for files with a `.css` or `.scss` extension.
During `setup`, a `.stylelintrc` is copied into the root of your app that is pre-configured with defaults for CSS/SASS Modules. You can add or update any of the [Stylelint rules](http://stylelint.io/user-guide/rules/) in your `.stylelintrc`.

### proto

kyt provides a scratch space for building simple prototypes alongside your app.
To get started, follow the setup instructions below.

#### How Prototype Works

1. Create a `prototype.js` file.

The proto command takes a `prototype.js` file at the root of your app as an entry for a dev server. You can use this file as the start of your prototype.

2. index.html

The proto command also provides an `index.html` file with the following content:
```
<div id="root"></div>
<script src="/prototype/bundle.js"></script>
```

`/prototype/bundle.js` loads the JavaScript assets.


#### The proto command

Running `proto` starts a dev server at the port specified in your `kyt.config.js`

```
✅  webpack-dev-server http://localhost:3002/prototype
```

#### Updating the prototype Webpack config

You can update the prototype config by using the modifyWebpackConfig function in `kyt.config.js`.
See [modifyWebpackConfig](/kytConfig.md) instructions.

### setup

The `setup` command sets up your repo with all the things you'll need to use kyt.

1. Creates a new [kyt.config.js](/config/kytConfig.md)
2. Creates a .gitignore and .editorconfig
3. Creates an .eslintrc file
4. Creates a .stylelintrc file
4. Adds kyt commands to npm scripts

If you would like to use a starter-kyt in your app, see directions below. 

#### setup with a starter-kyt

`setup` also allows you to plug a starter-kyt into to your app.

Running `kyt setup` will give you the option to install the default starter-kyt.

You can also pass the `-r` flag with any starter-kyt github repo

`setup` will then:
1. Clone the repo for your starter
2. Install necessary npm packages
3. Copy configuration and src
4. Copy lint configs into your root
5. Add kyt commands to your npm scripts

After that you're ready to build.
