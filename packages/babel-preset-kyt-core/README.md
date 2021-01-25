## babel-preset-kyt-core

[![npm](https://img.shields.io/npm/v/babel-preset-kyt-core.svg?maxAge=2592000)](https://www.npmjs.com/package/babel-preset-kyt-core)

A wrapper around [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) with sane defaults.

## Installation

```sh
$ yarn add --dev babel-preset-kyt-core
$ npm i --save-dev --save-exact babel-preset-kyt-core
```

## Options

- `includeRuntime (Boolean)` option to `true` to automatically load [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/en/babel-plugin-transform-runtime) **(RECOMMENDED!)**.

```js
module.exports = {
  presets: [
    [
      'babel-preset-kyt-core',
      {
        includeRuntime: true,
      },
    ],
  ],
};
```

When using this option, your application will need to install [`@babel/runtime`](https://babeljs.io/docs/en/babel-runtime):

```sh
$ yarn add @babel/runtime
$ npm i --save-exact @babel/runtime
```

- `typescript (Boolean)` option to `true` to automatically load [`@babel/preset-typescript`](https://babeljs.io/docs/en/babel-preset-typescript).

```js
module.exports = {
  presets: [
    [
      'babel-preset-kyt-core',
      {
        typescript: true,
      },
    ],
  ],
};
```

When using this option, your application will need to install [`@babel/preset-typescript`](https://babeljs.io/docs/en/babel-preset-typescript):

```sh
$ yarn add -D @babel/preset-typescript
$ npm i --save-dev --save-exact @babel/preset-typescript
```

- `envOptions (Object)`

When used with `kyt`, using this preset allows you to specify different configuration values for `client` and `server`. By declaring `envOptions`, you can set options that are passed to [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env):

```js
module.exports = {
  presets: [
    [
      'babel-preset-kyt-core',
      {
        // these are the default values for `targets`
        envOptions: {
          client: {
            targets: {
              browsers: ['>1%', 'last 4 versions', 'not ie < 11'],
            },
          },
          server: {
            targets: {
              node: 'current',
            },
          },
        },
      },
    ],
  ],
};
```

Without `kyt`, only the values set for `client` will be used.

To support multi-configuration (`client` / `server`) when **not** using `kyt`, set `KYT_ENV_TYPE` before running Babel compilation.

`KYT_ENV_TYPE` (supported values):

- `client`
- `server`
- `test`

Example:

```sh
// using `@babel/cli`
KYT_ENV_TYPE=server babel src -d lib

// using `webpack`
KYT_ENV_TYPE=server webpack --config webpack.server.config.js
```

These are sensible defaults that work well with `kyt` out of the box. The `client` option, typically reserved for client builds in kyt, is used to target browsers. The `server` option targets the current version of node.

The `client.targets.browsers` configuration is in the [browserslist](https://github.com/sitespeedio/browsertime) format.

## Polyfilling

This preset has `core-js@3*` as a dependency, but to add polyfills to Webpack entrypoints, you need to include any relevant polyfills while building your project.

The convention in `kyt` is add them to `src/client/polyfills.js`:

```js
// src/client/polyfills.js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

In your Webpack configuration:

```js
// webpack.client.config.js
module.exports = {
  target: 'web',
  entry: {
    main: ['/path/to/src/client/polyfills.js', '/path/to/src/client/index.js'],
  },
};
```
