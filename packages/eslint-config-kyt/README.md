### eslint-config-kyt

## Installation

#### yarn

```sh
$ yarn add --dev --exact @babel/core @babel/eslint-parser @babel/eslint-plugin eslint prettier \
  eslint-config-airbnb eslint-config-prettier eslint-plugin-import \
  eslint-plugin-jest eslint-plugin-jest-formatting \
  eslint-plugin-json eslint-plugin-jsx-a11y eslint-plugin-prettier \
  eslint-plugin-react eslint-plugin-react-hooks eslint-config-kyt

# or

$ npm i --save-dev --save-exact @babel/core @babel/eslint-parser @babel/eslint-plugin eslint prettier \
  eslint-config-airbnb eslint-config-prettier eslint-plugin-import \
  eslint-plugin-jest eslint-plugin-jest-formatting \
  eslint-plugin-json eslint-plugin-jsx-a11y eslint-plugin-prettier \
  eslint-plugin-react eslint-plugin-react-hooks eslint-config-kyt
```

Add to the `extends` section of your ESLint configuration:

`.eslintrc(.json)`:

```json
{
  "extends": ["kyt"],
  "rules": {}
}
```

`.eslintrc.js`:

```js
module.exports = {
  extends: ['kyt'],
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
    'kyt',
  ],
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

## Differences from Similar ESLint Configs

This config is based on the following ESLint configs:
- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- [eslint-config-kyt](../eslint-config-kyt)
- [eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript)

The TypeScript-specific portions of the config are primarily based on [eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript), with these notable differences:

- Enables the [`@typescript-eslint/no-explicit-any`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md) rule by default
- Extends the [`prettier/@typescript-eslint`](https://github.com/prettier/eslint-config-prettier#installation) config by default
- Uses [`@babel/eslint-parser`](https://www.npmjs.com/package/@babel/eslint-parser) for JavaScript files and [`@typescript-eslint/parser`](https://www.npmjs.com/package/@typescript-eslint/parser) for TypeScript files (`.ts` / `.tsx`)
- Disables @typescript-eslint rules that require parserServices to be generated (by setting `parserOptions.project` to the path to a tsconfig.json file), which has a high performance cost in big projects and requires additional end user configuration
