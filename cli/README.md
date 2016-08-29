# kyt CLI

## CLI
kyt includes a CLI with all the basic commands needed for development.
During `setup` the commands are written into your package.json file.
You can also run them with `node_modules/.bin/kyt commandName`

1. `dev` starts up a Webpack dev server
2. `build` compiles server and client code for production use
3. `run` runs production code
4. `test` runs AVA on all tests in /src
5. `proto` starts the prototyping app
6. `lint` lints src code using ESlint
7. `help` shows commands and their documentation 
8. `setup` sets up kyt and can install a specified [starter-kyt](/Starterkyts.md)

## kyt commands explained 

### dev
The `dev` command takes the entry index.js in `client/` and `server/`, compiles them, and starts a webpack dev server on the specified ports. The dev server includes live reloading to allow for faster development. 
You can change ports in the [kyt config](/config/kytConfig.md).

### build
The `build` command takes the entry index.js in client and server, compiles them, and saves them to a build folder. This is a production build and includes minification and tree shaking (with Webpack 2). 

Build uses option `-c`(`--config`) to denote a path to a different [kyt.config.js](/config/kytConfig.md) file

### run
The `run` command takes the compiled code from the production build and runs a node server at the specified port. 
You can change ports in the kyt config.

### test
The `test` command takes any test files in your src directory and runs them using [Ava](https://github.com/avajs/ava). 
kyt test looks for any `*.test.js` files in `src/`.

### lint
The `lint` command lints all files in the src directory using ESLint. 
During setup, an `.eslintrc` is copied into the root of your app. 
You can add or update any rules from this file. 

kyt's ESLint config extends [Airbnb](https://github.com/airbnb/javascript)

### lint-style
The `lint-style` command uses Stylelint to lint all files in the src directory. By convention, it look for files with a `.css` or `.scss` extension.
During `setup`, a `.stylelintrc` is copied into the root of your app that is pre-configured with sensible defaults for CSS/SASS Modules. Feel free to add or update any of the pre-configured [Stylelint rules](http://stylelint.io/user-guide/rules/) in your `.stylelintrc`. 

### proto
The `proto` command starts a webpack dev server for building prototypes.
More about [prototyping with kyt](/prototype)

### setup

The `setup` command sets up your repo with all the things you'll need to use kyt.

1. Create a new [kyt.config.js](/config/kytConfig.md)
2. Create a .gitignore and .editorconfig
3. Create eslint.json file
4. Add kyt commands to npm scripts


#### setup with a starter-kyt

`setup` also allows you to plug a starter-kyt into to your app. 

The command has one flag:
1. `kyt setup -r` : the `-r` flag allows you to specify any github repo for a starter-kyt

`setup` will then:
1. Clone the repo for your starter
2. Install necessary npm packages
3. Copy configuration and src
4. Copy lint configs into your root
5. Add kyt commands to your npm scripts 

After that you're ready to build. 
