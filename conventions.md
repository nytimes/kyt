# kyt Conventions

In order to use kyt, your project must follow these conventions.

## Directory Structure

kyt follows several conventions for folder structure. If you're setting up a new project, structure your directory like the following:
```
src/
  /client
    index.js // webpack entry for client code
  /server
    index.js // wepack entry for server code
```
## Testing
The `kyt test` command finds all files with `*.test.js`

## kyt.config.js
The kyt config file must live in the root of your repository.
See further instructions [here](/config/kytConfig.md)
