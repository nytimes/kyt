# jest-preset-kyt-styled

Jest preset for Stylelint-ing files in CSS-in-JS projects. Internally, uses these packages from the [`styled-components`](https://styled-components.com/) project:

* [stylelint-config-styled-components](https://github.com/styled-components/stylelint-config-styled-components)
* [stylelint-processor-styled-components](https://github.com/styled-components/stylelint-processor-styled-components)

## Installation

```sh
yarn add --dev jest jest-preset-kyt-styled

// or

npm i --save-dev --save-exact jest jest-preset-kyt-styled
```

## Setup

In your local Jest config - for instance, `jest.config.js`:

```js
module.exports = {
  preset: 'jest-preset-kyt-styled',
  // By default, looks for files named `styled.js` in `src` (NYT convention)
  // change this value to match your project files that contain CSS-in-JS
  testMatch: ['<rootDir>/src/**/**/styled.js'],
}
```
