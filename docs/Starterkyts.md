# Starter-kyts

The following is a guide for building starter-kyts. If you would like to know more about installing a starter-kyt, check out the [`setup` command]((/docs/commands.md#setup)).

## How to build a starter-kyt
starter-kyts act as boilerplates for projects. They use kyt as their build system and add additional source code and tools.

1. Choose your starter-kyt architecture. Make sure you are familiar with the [kyt conventions](/docs/conventions.md).

2. Add additional dependencies to a package.json

3. Set up `/src/server/index.js` and `/src/client/index.js` files

4. Optionally add a package.json `kyt` object configuration with the following keys and values:

    - `version` (*default:* `undefined`) - use this to lock down the starter-kyt kyt dependency version. This should be in [value/range semver form](https://github.com/npm/node-semver#versions).
    - `files` (*default:* `[]`) - an array of files/paths to copy into a user's project.
    - `scripts` (*default:* `[]`) - an array of package.json script names to copy into the user's package.json scripts.

4. Create documentation

5. Submit to kyt to be considered as a recommended starter-kyt
