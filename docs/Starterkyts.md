# `starter-kyt`s

The following is a guide for building `starter-kyt`s. If you would like to know more about installing a `starter-kyt`, check out the [`kyt setup` tool](/packages/kyt-core/README.md).

## How to build a `starter-kyt`

`starter-kyt`s act as boilerplates for projects. They use `kyt` as their build system and add additional source code and tools.

- Choose your `starter-kyt` architecture. Make sure you are familiar with the [kyt conventions](/docs/conventions.md).

- Add dependencies to a `package.json`

- Set up `/src/client/index.js` and `/src/server/index.js` (either is optional if `hasClient: false` or `hasServer: false` is set in [config](/docs/kytConfig.md)):

```
src/
  client/
    index.js
    polyfills.js
  server/
    index.js
    polyfills.js
kyt.config.js
package.json
```

- Add a `package.json` `kyt` object configuration with the following keys and values:

  - `files` (_default:_ `[]`) - an array of files/paths to copy into a user's project. This acts as the manifest for your starter-kyt and should include all necessary files and folders. You do not need to list `package.json`, but you do need to list folders like `src` and `test`.

```json
{
  "scripts": {
    "typings": "typings install",
    "lint": "yarn tslint 'src/**/*.ts'"
  },
  "kyt": {
    "files": [".gitignore", "src", "tsconfig.json", "tslint.json", "typings.json"]
  }
}
```

- Create documentation
