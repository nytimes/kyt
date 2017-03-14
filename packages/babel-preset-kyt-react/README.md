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

### `0.2.0`

- Updates `babel-preset-kyt-core` to `0.2.0-rc.1` to allow parsing of [dynamic `import()`](https://webpack.js.org/guides/code-splitting-import/#dynamic-import).
