## babel-preset-kyt-react

[![npm](https://img.shields.io/npm/v/babel-preset-kyt-react.svg?maxAge=2592000)](https://www.npmjs.com/package/babel-preset-kyt-react)
This is a babel preset meant for React projects built with kyt.

See the included presets and plugins [here](/packages/babel-preset-kyt-react/lib/index.js)
(Note: this preset includes babel-preset-kyt-core)

To use in your project:
1. `npm install babel-preset-kyt-react --save`
2. In your .babelrc:
```
  {
    presets: [
      "babel-preset-kyt-react"
    ]
  }
```

## Options

*(see [documentation](https://babeljs.io/docs/plugins/#plugin-preset-options) for Babel preset options)*

- `coreOptions` (`Object`) - options object to pass through to `babel-preset-kyt-core`; default `{}`

## CHANGELOG

### `0.3.0-alpha.6` - 10/06/17

- Adds `babel-preset-kyt-core` dependency upgrade which adds `babel-preset-env` `useBuiltIns` option for server polyfilling.

### `0.3.0-alpha.5` - 10/03/17

- Adds `babel-preset-kyt-core` dependency upgrade which adds `babel-preset-env` `useBuiltIns` option to take advantage of only polyfilling what's needed.

### `0.3.0-alpha.4` - 09/19/17

- Removes default `node` environment when `KYT_ENV_TYPE=test`. See more in the [kyt-core 0.3.0 changelog](/packages/babel-preset-kyt-core/README.md#changelog).

### `0.3.0-alpha.3` - 09/19/17

- Adds `KYT_ENV_TYPE=test` support for `test` runs. You can pass a `test` override option into `envOptions`. See more in the [kyt-core 0.3.0 changelog](/packages/babel-preset-kyt-core/README.md#changelog).

### `0.3.0-alpha.2` - 09/18/17

- Fixes bugs introduced in the 0.3.0-alpha.1 `babel-preset-kyt-core` release. [For more](/packages/babel-preset-kyt-core/README.md#changelog).

### `0.3.0-alpha.1` - 09/17/17

- Updates `babel-preset-kyt-core` to `0.3.0` to take advantage of `babel-preset-env`. `babel-preset-kyt-react` passes down options to extend preset-env, so you can read more about the `envOptions` option in the [kyt-core 0.3.0 changelog](/packages/babel-preset-kyt-core/README.md#changelog).

### `0.2.0` - 03/23/17

- Updates `babel-preset-kyt-core` to `0.2.0` to allow parsing of [dynamic `import()`](https://webpack.js.org/guides/code-splitting-import/#dynamic-import).
