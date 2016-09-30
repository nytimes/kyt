
## Master

## 0.2.2 (Sept 23, 2016)

- Fixes linter `Configuration for rule "eol-last" is invalid` ESLint bug by upgrading all of the linter dependencies.

## 0.2.1 (Sept 23, 2016)

- Fixes `kyt lint-style` bug where the base config file name was incorrect (#180).

## 0.2.0 (Sept 23, 2016)

### BREAKING CHANGES

#### `kyt test` now uses [Jest](https://github.com/NYTimes/kyt/commit/55d51626405cb2be3046cc78e38d285e8116d1a3)

See the new [testing docs](/docs/commands.md#test).
Read more about [Jest](https://facebook.github.io/jest/)

If you've already written tests in Ava check out these code mods from [mikenikles](https://github.com/mikenikles/jscodeshift-ava-to-jest) and [dcousineau](https://gist.github.com/dcousineau/0170c4cf30bcc83ebf1a39b4636ae7d6) as a resource for upgrading.

#### support of other ESLint and StyleLint file types

.eslintrc --> .eslintrc.json
.stylelintrc --> .stylelintrc.json

kyt adds these linter files to your project on setup. These files now reference base linter files in kyt to allow for easier upgrades. As always you can use these files to create your own overrides.

#### kyt's global variables are now in a [KYT global object](/docs/conventions.md#environment-variables) rather than process.env

### BUG FIXES

* [Fixes](https://github.com/NYTimes/kyt/commit/af786d7b9a7d2b0834bdaa2b20be7b9268656934) bug where dev server child process was not killed after Webpack build error
* [Fixes](https://github.com/NYTimes/kyt/commit/2d72505e89f5abd04357aa7c758894f9f8f4cef2) bug where lint rule was deprecated and showing error

## 0.1.0 (Sept 12, 2016)

* Initial public release

