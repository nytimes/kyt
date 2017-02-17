# kyt ESLint Linter and JavaScript Style Guide

This is an extension of the Airbnb [**JavaScript**](https://github.com/airbnb/javascript) and [**React**](https://github.com/airbnb/javascript/tree/master/react) style guides and [ESLint](http://eslint.org/) linter. Overrides, additions and warnings have been added to this document and the project lint configuration.

## Table of Contents

   1. [Install](#install)
   1. [JavaScript Overrides](#javascript-overrides)
   1. [React Overrides](#react-overrides)
   1. [ESLint Additions](#eslint-additions)
   1. [Changelog](#changelog)

## Install

Note, installing `kyt` or setting up a starter-kyt will install this package automatically. If you want to install this linter extension separately, follow these install instructions. If you have `kyt` installed and you want to override the linter configuration, skip to step (2).

1. Install the _eslint-config-kyt_ node module and its dependencies:  
  `npm install eslint eslint-config-kyt eslint-config-airbnb eslint-plugin-import eslint-plugin-json eslint-plugin-jsx-a11y eslint-plugin-react --save-dev`
2. Copy the following into an `.eslintrc` in your project:  
```js
{
  "extends": "eslint-config-kyt",
  "rules": {
    /* If you must, override rules here :P */
  }
}
```

## JavaScript Overrides

**[11.1 _Don't use iterators._](https://github.com/airbnb/javascript#iterators--nope)** - This eslint rule has been overridden to allow iterators, but using JavaScript higher-order functions is still preferred.

**[11.2 _Don't use generators for now._](https://github.com/airbnb/javascript#generators--nope)** - This eslint rule has been overridden. It is ok to use generators in node.js but it is advised not to use them on the client-side.

## React Overrides

**[Ordering](https://github.com/airbnb/javascript/tree/master/react#ordering)** - Nah.

## Eslint Additions

**[no-lonely-if](http://eslint.org/docs/rules/no-lonely-if)** - _Disallow if as the only statement in an else block._

**[max-nested-callbacks](http://eslint.org/docs/rules/max-nested-callbacks)** - _Enforces a maximum depth that callbacks can be nested to increase code clarity._ (5)

**[constructor-super](http://eslint.org/docs/rules/constructor-super)** - _Aimed to flag invalid/missing super() calls._

**[no-this-before-super](http://eslint.org/docs/rules/no-this-before-super)** - _Aimed to flag this/super keywords before super() callings._

**[prefer-spread](http://eslint.org/docs/rules/prefer-spread)** - _Aimed to flag usage of Function.prototype.apply() that can be replaced with the spread operator._

## Changelog

**0.2.0** - 02/07/17

### BREAKING CHANGES

`dependencies` were converted to `peerDependencies` and `kyt` now includes the dependencies. If you're using `kyt`, then an `npm install` should be enough. If you installed this package as a standalone extension then you'll need to follow the Installation instructions and `npm install` the named dependencies.

### FEATURES

### FIXES

**0.0.1 - 0.1.0 ** - 12/08/16 - life
