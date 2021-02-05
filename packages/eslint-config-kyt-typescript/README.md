### eslint-config-kyt-typescript

## Installation

#### yarn

```sh
$ yarn add --dev --exact @babel/core @babel/eslint-parser @babel/eslint-plugin \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-typescript \
  typescript eslint prettier eslint-config-airbnb eslint-config-prettier eslint-plugin-import \
  eslint-plugin-jest eslint-plugin-jest-formatting \
  eslint-plugin-json eslint-plugin-jsx-a11y eslint-plugin-prettier \
  eslint-plugin-react eslint-plugin-react-hooks eslint-config-kyt

# or

$ npm i --save-dev --save-exact @babel/core @babel/eslint-parser @babel/eslint-plugin \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-typescript \
  typescript eslint prettier eslint-config-airbnb eslint-config-prettier eslint-plugin-import \
  eslint-plugin-jest eslint-plugin-jest-formatting \
  eslint-plugin-json eslint-plugin-jsx-a11y eslint-plugin-prettier \
  eslint-plugin-react eslint-plugin-react-hooks eslint-config-kyt
```

Add to the `extends` section of your ESLint configuration:

`.eslintrc(.json)`:

```json
{
  "extends": ["kyt-typescript"],
  "rules": {}
}
```

`.eslintrc.js`:

```js
module.exports = {
  extends: ['kyt-typescript'],
  // shorthand: ['kyt-typescript']
  rules: {
    /* If you must, override rules here :P */
  },
};
```

## Prettier Support

```js
yarn eslint . --fix
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
1. Add the following settings:

```
"prettier.eslintIntegration": true,
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
},
```

#### Atom

1. Go to `Preferences > Install`
1. Install `linter`
1. Install `linter-eslint`
1. Install `prettier-atom`. In the `prettier-atom` settings, check the `ESLint Integration` checkbox.
1. Make sure all packages are enabled. You may need to restart Atom.
