# kyt conventions

In order to use kyt, your project must follow these conventions.

## Directory Structure

kyt follows several conventions for folder structure. If you're setting up a new project, structure your directory as follows.
```
src/
  /client
    index.js // Webpack entry for client code
  /server
    index.js // Webpack entry for server code
```
## Testing
The `kyt test` command finds all files with `*.test.js` in the `/src` directory.

## Style Linting
The `kyt lint-style` command finds all files with `.css` and `.scss` extensions in the `/src` directory.

## kyt.config.js
The kyt config file must live in the root of your repository.
See further instructions [here](/config/kytConfig.md)
