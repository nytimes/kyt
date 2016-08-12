# kyt CLI

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
8. `kyt setup` sets up kyt and installs  a specified starter kyt

## kyt Commands Explained 

### kyt dev
The `dev` command takes the entry index.js in client and server, compiles them, and starts up a webpack dev server on the specified ports. The dev server includes a react hot loader to allow for faster development. 
You can change ports in the kyt config.

### kyt build
The `build` command takes the entry index.js in client and server, compiles them, and saves them to a build folder. This is a production build and includes minification and tree shaking (with webpack 2). 

### kyt run
The `run` command takes the copiled code from the production build and runs a node server at the specified port. 
You can change ports in the kyt config.

### kyt test
The `test` command takes any test files in your src directory and runs them using Ava. 

### kyt lint
The `lint` command lints all files in the src directory using eslint. 
You can override the base eslint file in the kyt config.

### kyt proto
The `proto` command starts up a webpack dev server for building quick prototypes with react components. 

### kyt setup
the `setup` command allows you to plugin a starter-kyt to your app. The command has two options:
1. use the default starter: running `kyt setup` without any flags will give you the default starter
2. `kyt setup -r` : the `-r` flag allows you to specify any github repo for a starter-kyt.

`setup` will then:
1. clone the repo for your starter
2. Install necessary npm packages
3. Copy configuration and src
4. Add kyt commands to your npm scripts 

After that you're ready to build. 
