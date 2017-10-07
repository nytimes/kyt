## babel-preset-kyt-core

[![npm](https://img.shields.io/npm/v/babel-preset-kyt-core.svg?maxAge=2592000)](https://www.npmjs.com/package/babel-preset-kyt-core)

An opinionated [Babel preset](https://babeljs.io/docs/plugins/#presets), best used with [kyt](https://github.com/NYTimes/kyt).

This preset is used as a default if a kyt project does not include a .babelrc
It is also included as part of [babel-preset-kyt-react](/packages/babel-preset-kyt-react)

To install:
1. `npm install babel-preset-kyt-core --save`
2. In babelrc:
```
  {
    presets: [
      "babel-preset-kyt-core"
    ]
  }
```

## Options

*(see [documentation](https://babeljs.io/docs/plugins/#plugin-preset-options) for Babel preset options)*

- `includeRuntime` (`Boolean`) - whether or not to include [`babel-plugin-transform-runtime`](https://www.npmjs.com/package/babel-plugin-transform-runtime); default: `false`

## CHANGELOG

### `0.3.0-alpha.6` - 10/06/17

- Adds `babel-preset-env` `useBuiltIns` option to take advantage of only polyfilling server builds. To take advantage of this functionality, you need to add `babel-polyfill` as a `dependency` and import it at the top of `src/server/index.js`.

### `0.3.0-alpha.5` - 10/03/17

- Adds `babel-preset-env` `useBuiltIns` option to take advantage of only polyfilling what's needed. To take advantage of this functionality, you need to add `babel-polyfill` as a `dependency` and import it at the top of `src/client/index.js`.

### `0.3.0-alpha.4` - 09/19/17

- Removes default `node` environment when `KYT_ENV_TYPE=test`.

### `0.3.0-alpha.3` - 09/19/17

- Adds `KYT_ENV_TYPE=test` support for `test` runs. Similar to the `client/server` options, the `test` option can be overridden in `envOptions`.

### `0.3.0-alpha.2` - 09/18/17

- Fixes bugs introduced in the 0.3.0-alpha.1 release where user `envOptions` overrides were not being deeply merged and the `uglify` option was not nested in the `targets` param.

### `0.3.0-alpha.1` - 09/17/17

- Replaces `babel-preset-latest` with `babel-preset-env`. By default, the following `client` preset-env browser targets are used:

```
modules: false,
targets: {
  browsers: ['>1%', 'last 4 versions', 'not ie < 11']
}
```
Which at the timing of this release, targets the following browsers/OSs:

```
{
  "chrome": "49",
  "android": "4.2",
  "edge": "12",
  "firefox": "52",
  "ie": "11",
  "ios": "9",
  "safari": "9"
}
```

If you need to target the `server`, then you can set `process.env.KYT_ENV_TYPE` to `server`. The following preset-env server targets are used:

```
modules: false,
targets: {
  node: true
}
```

You can extend the default preset-env `client`/`server` targets by passing in your own options into a .babelrc configuration under a `envOptions` key. For example:

```
{
  "presets": [
    [
      "kyt-core", {
        "envOptions": {
          "client": {
            "debug": true,
            "targets": {
              "browsers": ["last 2 versions"]
            }
          },
          "server": {
            "modules": true,
            "targets": { "node": false }
          },
        },
      },
    ],
  ],
}
```

### `0.2.0` - 03/23/17

- Includes [`babel-plugin-syntax-dynamic-import`](https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import) to allow parsing of [dynamic `import()`](https://webpack.js.org/guides/code-splitting-import/#dynamic-import).
