# kyt ESLint Linter and JavaScript Style Guide

This is an extension of the Airbnb [**JavaScript**](https://github.com/airbnb/javascript) and [**React**](https://github.com/airbnb/javascript/tree/master/react) style guides and [ESLint](http://eslint.org/) linter.

## Install

Note, setting up a `starter-kyt` will install this package automatically.

1. Install `eslint-config-kyt` and its dependencies:
   ```sh
   yarn add --dev eslint@6.8.0 \
    babel-eslint@10.1.0 \
    prettier@2.0.5 \
    eslint-config-airbnb@18.1.0 \
    eslint-config-prettier@6.11.0 \
    eslint-config-kyt \
    eslint-plugin-import@2.21.2 \
    eslint-plugin-json@2.1.1 \
    eslint-plugin-jsx-a11y@6.2.3 \
    eslint-plugin-prettier@3.1.4 \
    eslint-plugin-react@7.20.0 \
    eslint-plugin-react-hooks@4.0.4
  ```
  ```sh
   npm i --save-dev --save-exact eslint@6.8.0 \
    babel-eslint@10.1.0 \
    prettier@2.0.5 \
    eslint-config-airbnb@18.1.0 \
    eslint-config-prettier@6.11.0 \
    eslint-config-kyt \
    eslint-plugin-import@2.21.2 \
    eslint-plugin-json@2.1.1 \
    eslint-plugin-jsx-a11y@6.2.3 \
    eslint-plugin-prettier@3.1.4 \
    eslint-plugin-react@7.20.0 \
    eslint-plugin-react-hooks@4.0.4
   ```
2. Copy the following into an `.eslintrc.js` in your project:

  ```js
  module.exports = {
    extends: ['eslint-config-kyt'],
    // shorthand: ['kyt']
    rules: {
      /* If you must, override rules here :P */
    },
  };
```

To add a subset of rules, you can specify one of the following:

  ```js
  module.exports = {
    extends: [
      // extends airbnb/base and contains all of our custom rules
      'kyt/base',
      // adds `jest` and `jest-formatting` plugins
      'kyt/jest',
      // adds Airbnb's React rules before our custom rules
      'kyt/react',
      // all rules
      'kyt'
    ]
  }
  ```

## Prettier Support

```js
npx eslint . --fix
```

Or add to your `package.json`:

  ```
  {
    "scripts": {
      "lint": "eslint .",
      "lint-fix": "eslint . --fix"
    }
  }
```

To keep things formatted as you develop, install an editor package. See more [here](/docs/Recipes.md#editor-configuration).

## Editor Configuration

A `kyt` app should work with any editor, but we recommend that you install and configure ESLint with one of the following editors:

### VSCode

1. go to View > Extensions
1. Install `ESLint`
1. Install `Prettier`
1. Go to `Code > Preferences`
1. Change the following preferences to `true`:

  ```
  "prettier.eslintIntegration": true,
  "editor.formatOnSave": true
  ```

### Atom

1. Go to `Preferences > Install`
1. Install `linter`
1. Install `linter-eslint`
1. Install `prettier-atom`. In the `prettier-atom` settings, check the `ESLint Integration` checkbox.
1. Make sure all packages are enabled. You may need to restart Atom.
