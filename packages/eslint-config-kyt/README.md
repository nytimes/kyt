### eslint-config-kyt

## Installation

#### yarn
```sh
yarn add --dev eslint@6.8.0 \
  babel-eslint@10.1.0 \
  prettier@2.0.5 \
  eslint-config-airbnb@18.2.0 \
  eslint-config-prettier@6.11.0 \
  eslint-config-kyt \
  eslint-plugin-import@2.22.0 \
  eslint-plugin-jest@23.18.0 \
  eslint-plugin-jest-formatting@2.0.0 \
  eslint-plugin-json@2.1.1 \
  eslint-plugin-jsx-a11y@6.3.1 \
  eslint-plugin-prettier@3.1.4 \
  eslint-plugin-react@7.20.3 \
  eslint-plugin-react-hooks@4.0.7

# or

npm i --save-dev --save-exact eslint@6.8.0 \
  babel-eslint@10.1.0 \
  prettier@2.0.5 \
  eslint-config-airbnb@18.2.0 \
  eslint-config-prettier@6.11.0 \
  eslint-config-kyt \
  eslint-plugin-import@2.22.0 \
  eslint-plugin-jest@23.18.0 \
  eslint-plugin-jest-formatting@2.0.0 \
  eslint-plugin-json@2.1.1 \
  eslint-plugin-jsx-a11y@6.3.1 \
  eslint-plugin-prettier@3.1.4 \
  eslint-plugin-react@7.20.3 \
  eslint-plugin-react-hooks@4.0.7
```

Add to the `extends` section of your ESLint configuration:

`.eslintrc(.json)`:
```json
{
  "extends": ["eslint-config-kyt"],
  "rules": {}
}
```
`.eslintrc.js`:
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

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint-fix": "eslint . --fix"
  }
}
```

## Editor Configuration

To automatically format your code based on these rules during development, install a package for your IDE. We recommend that you install and configure ESLint with one of the following editors:

#### VSCode

1. go to View > Extensions
1. Install `ESLint`
1. Install `Prettier`
1. Go to `Code > Preferences`
1. Change the following preferences to `true`:

```
"prettier.eslintIntegration": true,
"editor.formatOnSave": true
```

#### Atom

1. Go to `Preferences > Install`
1. Install `linter`
1. Install `linter-eslint`
1. Install `prettier-atom`. In the `prettier-atom` settings, check the `ESLint Integration` checkbox.
1. Make sure all packages are enabled. You may need to restart Atom.
