
## 0.1.0 (Sept 12, 2016)

* Initial public release

## 0.2.0 (Sept 22, 2016)


### BREAKING CHANGES
#### `kyt test` now uses [Jest](https://github.com/NYTimes/kyt/commit/55d51626405cb2be3046cc78e38d285e8116d1a3)

If you've already written tests in Ava you can use this code mod as a resource for upgrading.

#### support of other ESLint and StyleLint file types
.eslintrc --> .eslintrc.json
.stylelintrc --> .stylelintrc.json

kyt adds these linter files to your project on setup. These files now reference base linter files in kyt to allow for easier upgrades. As always you can use these files to create your own overrides.

#### kyt's global variables are now in a [KYT global object](https://github.com/NYTimes/kyt/commit/4d934378c9271b9b4115e42619d78fcc09ea2d7c) rather than process.env

### BUG FIXES
* [Fixes](https://github.com/NYTimes/kyt/commit/af786d7b9a7d2b0834bdaa2b20be7b9268656934) bug where dev server child process was not killed after Webpack build error
* [Fixes](https://github.com/NYTimes/kyt/commit/2d72505e89f5abd04357aa7c758894f9f8f4cef2) bug where lint rule was deprecated and showing error
