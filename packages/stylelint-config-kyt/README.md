# kyt Stylelint Linter and CSS/Sass Style Guide

This is an extension of [config-standard](https://github.com/stylelint/stylelint-config-standard) with some overrides for CSS/Sass Modules.

## Table of Contents

  1. [Install](#install)
  1. [CSS + Sass Guide](#css--sass-guide)
    - [Formatting](#formatting)
    - [Comments](#comments)
    - [ID Selectors](#id-selectors)
    - [Syntax](#syntax)
    - [Ordering](#ordering-of-property-declarations)
    - [Variables](#variables)
    - [Mixins](#mixins)
  1. [Changelog](#changelog)

## Install

Note, installing `kyt` or setting up a starter-kyt will install this package automatically. If you want to install this linter extension separately, follow these install instructions. If you have `kyt` installed and you want to override the linter configuration, skip to step (2).

1. Install the _stylelint-config-kyt_ node module:  
  `npm install stylelint stylelint-config-kyt stylelint-config-standard --save-dev`
2. Add an extension to your Stylelint configuration:  
```js
{
  "extends": "stylelint-config-nyt",
  "rules": {
    /* If you must, override rules here :P */
  }
}
```

## CSS + Sass Guide

The following guide is best used with the kyt linter against CSS/Sass Modules.

### Formatting

* Use soft tabs (2 spaces) for indentation.
* Always use camelCasing in class names.
* Do not use ID selectors.
* Do not use element selectors in CSS Modules files.
* When using multiple selectors in a rule declaration, give each selector its own line.
* Put a space before the opening brace `{` in rule declarations.
* In properties, put a space after, but not before, the `:` character.
* Put closing braces `}` of rule declarations on a new line
* Put blank lines between rule declarations and nested pseudo-selectors.

**Bad**

```css
.avatar{
    border-radius:50%;
    border:2px solid white; }
.no, .nope, .not_good {
    // ...
}
#lol-no {
  // ...
}
```

**Good**

```css
.avatar {
  border-radius: 50%;
  border: 2px solid white;
}

.one,
.selector,
.perLine {
  // ...
}
```

### Comments

* Prefer line comments (`//` in Sass-land) to block comments.
* Prefer comments on their own line.
* Write detailed comments for code that isn't self-documenting:
  - Uses of z-index
  - Compatibility or browser-specific hacks

### ID selectors

While it is possible to select elements by ID in CSS, it should generally be considered an anti-pattern. ID selectors introduce an unnecessarily high level of [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) to your rule declarations, and they are not reusable.

You should never define an ID selector in a CSS Module.

### Syntax

* Use the `.scss` syntax, never the original `.sass` syntax
* Order your regular CSS and `@include` declarations logically (see below)

### Ordering of property declarations

1. `@include` or `composes` declarations
2. Property declarations in alphabetical order

    ```scss
    .btnGreen {
      @include transition(background 0.5s ease);
      background: green;
      color: red;
      font-weight: bold;
      // ...
    }
    ```
3. Nested pseudo-selectors

    Nested pseudo-selectors go last, and nothing goes after them.

    ```scss
    .btn {
      @include color(red);
      font-weight: bold;

      &:hover {
        cursor: pointer;
      }

    }
    ```

### Variables

Prefer camelCased variable names (e.g. `$myVariable`).

### Mixins

  - 1 space after the mixin name before the opening parens
  - 1 space after colons and between params
  - Commas are used as separators unless passing in a comma separated list as an argument, in these cases use a semicolon
Default values can be used when it's convenient

## Changelog

**Master**

**0.3.2** - 04/10/17

Removes `at-rule-no-unknown` so all sass syntax is supported.

**0.3.1** - 03/28/17

This release ensures using CSS modules selectors such as :global and :local
don't trigger invalid stylelint errors. Useful when using libraries such as
react-addons-css-transition-group.

**0.3.0** - 03/23/17

This release upgrades Stylelint from [7.5.0 to 7.9.0](https://github.com/stylelint/stylelint/blob/master/CHANGELOG.md) and stylelint-config-standard from [14.0.0 to 16.0.0](https://github.com/stylelint/stylelint-config-standard/blob/master/CHANGELOG.md).

### BREAKING CHANGES

### FEATURES

### FIXES

**0.2.0** - 02/07/17

### BREAKING CHANGES

`dependencies` were converted to `peerDependencies` and `kyt` now includes the dependencies. If you're using `kyt`, then an `npm install` should be enough. If you installed this package as a standalone extension then you'll need to follow the Installation instructions and `npm install` the named dependencies.

### FEATURES

### FIXES

**0.0.1 - 0.1.0 ** - 12/08/16 - life
