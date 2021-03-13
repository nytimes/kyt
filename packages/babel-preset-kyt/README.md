## babel-preset-kyt

[![npm](https://img.shields.io/npm/v/babel-preset-kyt-react.svg?maxAge=2592000)](https://www.npmjs.com/package/babel-preset-kyt)

Omnibus `kyt` Babel configuration with TypeScript support.

This preset includes [`babel-preset-kyt-core`](https://github.com/nytimes/kyt/tree/master/packages/babel-preset-kyt-core) and [`babel-preset-kyt-react`](https://github.com/nytimes/kyt/tree/master/packages/babel-preset-kyt-react) - you do not need to install them.

- Automatically strips `propTypes` when `(NODE|BABEL)_ENV=production`.
- Properly passes `{ development: true }` to [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react) when `(NODE|BABEL)_ENV=development`.

## Installation

```sh
$ yarn add --dev babel-preset-kyt
$ npm i --save-dev --save-exact babel-preset-kyt
```

## Options

- `useProductionTransforms` (`Boolean`) - whether to include these plugins; default: `true`:

  - [`@babel/plugin-transform-react-constant-elements`](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements)
  - [`@babel/plugin-transform-react-inline-elements`](https://babeljs.io/docs/en/babel-plugin-transform-react-inline-elements)

- `envOptions` (`Object`) - passed down to [`babel-preset-kyt-core`](https://github.com/nytimes/kyt/tree/master/packages/babel-preset-kyt-core). [See more](/packages/babel-preset-kyt-core/README.md#options).

- `includeRuntime` (`Boolean`) - whether or not to include [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/en/babel-plugin-transform-runtime); default: `false`
