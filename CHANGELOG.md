
## Master

## 0.3.0 (October 25, 2016)

### BREAKING CHANGES
- Upgrades Jest to version 16 [#259](https://github.com/NYTimes/kyt/pull/259)
  See [Jest docs](http://facebook.github.io/jest/blog/2016/10/03/jest-16.html) for information on latest updates.

- Upgrades Webpack to v2.1.0-beta.25 [#264](https://github.com/NYTimes/kyt/pull/264)
  Check the [recipes](/Recipes.md) to see the latest syntax for common extensions. Additional info in Webpack's [migration guide](https://webpack.js.org/how-to/upgrade-from-webpack-1/)

### FEATURES

- Adds serverless option to kyt [#174](https://github.com/NYTimes/kyt/pull/174)
  See the new [static starter-kyt](https://github.com/nytimes/kyt-starter-static)

- Flags can now be passed through to internal tools [#230](https://github.com/NYTimes/kyt/pull/230)

- Adds multiple server entry handling [#247](https://github.com/NYTimes/kyt/pull/247)

- Default starter-kyt on setup is now the [universal starter-kyt](https://github.com/NYTimes/kyt-starter-universal) [#265](https://github.com/NYTimes/kyt/pull/265)

- Assets now use chunkhash [#239](https://github.com/NYTimes/kyt/pull/239)

- Make logs more readable [#190](https://github.com/NYTimes/kyt/pull/190)

- Displays Gzip size of assets [#244](https://github.com/NYTimes/kyt/pull/244)

- Adds end to end tests [#241](https://github.com/NYTimes/kyt/pull/241)

## 0.2.2 (Sept 30, 2016)

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
