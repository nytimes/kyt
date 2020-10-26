### eslint-plugin-kyt

[![npm](https://img.shields.io/npm/v/eslint-plugin-kyt.svg?maxAge=2592000)](https://www.npmjs.com/package/eslint-plugin-kyt)

## Installation

```sh
$ yarn add --dev eslint-plugin-kyt
$ npm i --save-dev --save-exact eslint-plugin-kyt
```

Add to the `plugins` and `rules` sections of your ESLint configuration:

`.eslintrc(.json)`:

```json
{
  "plugins": ["kyt"],
  "rules": {
    "kyt/css-in-js-namespace": "error",
    "kyt/default-props": "error",
    "kyt/no-direct-moment-import": "error",
    "kyt/validate-double-underscore-dirs": "error"
  }
}
```

`.eslintrc.js`:

```js
module.exports = {
  plugins: ['kyt'],
  rules: {
    'kyt/css-in-js-namespace': 'error',
    'kyt/default-props': 'error',
    'kyt/no-direct-moment-import': 'error',
    'kyt/validate-double-underscore-dirs': 'error',
  },
};
```
