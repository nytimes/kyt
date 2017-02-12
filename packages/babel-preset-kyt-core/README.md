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
