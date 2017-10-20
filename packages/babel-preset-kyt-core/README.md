## babel-preset-kyt-core

[![npm](https://img.shields.io/npm/v/babel-preset-kyt-core.svg?maxAge=2592000)](https://www.npmjs.com/package/babel-preset-kyt-core)

An opinionated [Babel preset](https://babeljs.io/docs/plugins/#presets), best used with [kyt](https://github.com/NYTimes/kyt). Check out the Options for how to extend polyfill your build targets.

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

- `envOptions` (`Object`) - extend the default babel-preset-env options. The type of options, `client`, `server`, and `test`, are dependent on the value of `process.env.KYT_ENV_TYPE` which, when undefined, defaults to `client`. kyt will automatically set the `KYT_ENV_TYPE` when it runs commands. For debugging purposes, use `"debug": true` to see what the plugin is targeting. The following are the default babel-preset-env configurations used by kyt-core:

  - `client`
    ```
    modules: false,
    useBuiltIns: true,
    targets: {
      uglify: true,
      browsers: ['>1%', 'last 4 versions', 'not ie < 11'],
    },
    ```
  - `server`
    ```
    modules: false,
    useBuiltIns: true,
    targets: {
      node: 'current'
    },
    ```

  These are sensible defaults that work well with kyt out of the box. The `client` option, typically reserved for client builds in kyt, is used to target browsers, while the `server` option targets the current version of node. The `client.targets.browsers` configuration is in the [browserlist](https://github.com/sitespeedio/browsertime) format. The following is an example of how to override the option types in your babelrc configuration:

  ```
  {
    "presets": [
      [
        "babel-preset-kyt-core", {
          "envOptions": {
            "client": {
              "debug": true,
              "targets": {
                "browsers": ["last 2 versions"]
              }
            },
            "server": {
              "debug": true,
              "modules": true
            },
          },
        },
      ],
    ],
  }
  ```
  You can find additional options to configure babel-preset-env [here](https://github.com/babel/babel/tree/master/experimental/babel-preset-env#options).

- `includeRuntime` (`Boolean`) - whether or not to include [`babel-plugin-transform-runtime`](https://www.npmjs.com/package/babel-plugin-transform-runtime); default: `false`

## Polyfilling

By default `babel-preset-env`, an internal dependency, is configured to `useBuiltIns` which means that you can install `babel-polyfill` as a dependency in your project and `import 'babel-polyfill'` at the top of your entry file (in a kyt project that would be `src/client/index.js` and `src/server/index.js`) to include an optimized polyfill for your build.

## CHANGELOG

### `0.3.0` - XX/XX/XX

- Adds `babel-preset-env`, removes `babel-preset-latest`

### `0.2.0` - 03/23/17

- Includes [`babel-plugin-syntax-dynamic-import`](https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import) to allow parsing of [dynamic `import()`](https://webpack.js.org/guides/code-splitting-import/#dynamic-import).
