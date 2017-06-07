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
             // (ignored if hasServer is set to false in config)
```

## Public directory

During `build`, kyt copies a `/src/public` directory into the build folder. This folder is intended to be used to serve static assets.

## File extensions

### JavaScript
All `.js` files in `/src` are transpiled with Babel.

### CSS and Sass
`.css` files are intended for writing css with CSS Modules
`.scss` files are intended for writing Sass with CSS Modules

## Environment Variables

kyt sets several global variables with useful information about the app environment.

* `KYT.SERVER_PORT` Port your node server should listen on.
* `KYT.CLIENT_PORT` Port the client assets server is listening on.
* `KYT.PUBLIC_PATH` Full path for static assets server
* `KYT.PUBLIC_DIR` Relative path to the public directory
* `KYT.ASSETS_MANIFEST` Object with build assets paths
* `KYT.EXECUTION_ENVIRONMENT` Where this code is running: `"server"` or `"client"`

Note, these variables are casted to type String. For example, the following saves the server port as a Number to a local variable:

```
const port = Number.parseInt(KYT.SERVER_PORT, 10);
```

## Working with client assets

By default, kyt produces the following client assets (with their corresponding map files (asset.map.js)):

- `main.js` - The main script.
- `main.css` - All of the CSS.
- `manifest.js` - A mapping of chunk names.
- `vendor.js` - Common/shared modules between the bundles and chunks.

To keep each version of an asset unique, kyt will output the client assets with a hash in the name (e.g.: `main-34a8b999.js`) kyt also exports a `publicAssets.json` file that can be referenced using the `KYT.ASSETS_MANIFEST` environment variable. In your project, you should import the asset manifest file, get the hashed asset names and load the client assets through `<script>` tags. If you based your project on a starter kyt, then you already have this code in place in the `src/server/index.js`/`src/server/template.js`. If not, [check out the following lines](https://github.com/NYTimes/kyt/blob/master/packages/kyt-starter-universal/starter-src/src/server/index.js#L40-L43) for how you import the asset manifest and reference the assets. Note that the JavaScript assets need to be loaded in the following order:

- `manifest.js`
- `vendor.js`
- `main.js`

`main.css` should be included in the `<head>` of your document, which is taken care of for you if you based your project on a starter kyt.

## kyt.config.js
The kyt config file must live in the root of your repository.
See further instructions [here](/docs/kytConfig.md)

## Testing
The `kyt test` command finds all files with `*.test.js` in the `/src` directory.

## Linting

The `kyt lint-script` command finds all files with `.js` extension in `/src`

Specify lint rules with a `.eslintrc.json` file in the root of your project. [`setup`](/packages/kyt-cli/README.md) will create this file for you.

## Style Linting
The `kyt lint-style` command finds all files with `.css` and `.scss` extensions in `/src`

Specify lint rules with a `.stylelintrc.json` file in the root of your project. [`setup`](/packages/kyt-cli/README.md) will create this file for you.

## .babelrc
Making changes to babel settings should be done by creating a `.babelrc` file
