
# `kyt` Changelog

`kyt-cli` has a separate Changelog [here](/packages/kyt-cli/CHANGELOG.md).

## Master

## 0.8.0-alpha.1 - 07/11/17

- Upgrades jest to version 20
- Upgrades webpack to version 3

## 0.7.0 - 07/07/17

[0.6.x-0.7.0 Migration guide](/docs/migration-guides/0.6-0.7.md).

- Adds Prettier. See more in the [eslint-config-kyt README](/packages/eslint-config-kyt/README.md#changelog).
- Upgrades ESLint and Airbnb plugins. See more in the [eslint-config-kyt README](/packages/eslint-config-kyt/README.md#changelog).

## 0.6.1 - 06/28/17

- Fixes handling of user postcss.config.js override [#506](https://github.com/NYTimes/kyt/pull/506).

## 0.6.0 - 06/07/17

[0.5.x-0.6.0 Migration guide](/docs/migration-guides/0.5-0.6.md).

- Upgrades webpack and loaders [#482](https://github.com/NYTimes/kyt/pull/482)
- Adds vendor bundling [#487](https://github.com/NYTimes/kyt/pull/487)

## 0.5.5 - 05/02/17
- Fixes bug in IE11, moves 'react-hot-loader/patch' after 'babel-polyfill'.[#473](https://github.com/NYTimes/kyt/pull/473)
- Fixes history api for static starter-kyt [#468](https://github.com/NYTimes/kyt/pull/468)
- Adds `.ico` to file stub [#475](https://github.com/NYTimes/kyt/pull/475)
- Adds KYT.EXECUTION_ENVIRONMENT global [#465](https://github.com/NYTimes/kyt/pull/465)

## 0.5.4 - 04/10/17

Removes `at-rule-no-unknown` from stylelint configuration [#462](https://github.com/NYTimes/kyt/pull/462).

## 0.5.3 - 04/09/17

### FEATURES

- adds history api fallback to `dev` command for projects that use `hasServer=false` [#457](https://github.com/NYTimes/kyt/issues/457). Read more about how this affects the static starter kyt in the [notes on implementation section](/packages/kyt-starter-static#notes-on-implementation).

### BUGFIXES

- fixes `no-restricted-syntax` error in linter [#459](https://github.com/NYTimes/kyt/pull/459). Read more [here](/packages/eslint-config-kyt/README.md#changelog).

## 0.5.2 - 03/28/17

Adds Stylelint rule exceptions for common CSS Modules syntax, like `:global`, `:local`, etc. See more [here](/packages/stylelint-config-kyt/README.md).

## 0.5.1 - 03/27/17

Upgrades eslint to version 3.18 to get around an error. Read more [here](/packages/eslint-config-kyt/README.md).

## 0.5.0 - 03/23/17

[0.4.x-0.5.0 Migration guide](/docs/migration-guides/0.4-0.5.md).

### BREAKING CHANGES

#### Webpack 2.2 upgrade
Upgraded to final version of Webpack 2.

#### StyleLint upgrade.
 The upgrade involved updating the internal dependencies. Check out the changelog [here](/packages/stylelint-config-kyt/README.md).

#### ESLint upgrade.
The upgrade involved updating the internal dependencies. Check out the changelog [here](/packages/eslint-config-kyt/README.md).

#### Jest 19 Upgrade
Upgrade from Jest 16 [#422](https://github.com/NYTimes/kyt/pull/422)

### FEATURES
- Adds User survey link for modifyWebpackConfig [#433](https://github.com/NYTimes/kyt/pull/433)
- Adds starter-kyt versioning with npm [#425](https://github.com/NYTimes/kyt/pull/425)
- Adds additional functional tests [#405](https://github.com/NYTimes/kyt/pull/405)
- Adds source-map-support plugin [#402](https://github.com/NYTimes/kyt/pull/402)

### BUGFIXES
- Removes transform runtime plugin from Jest Config [#414](https://github.com/NYTimes/kyt/pull/414)
- Replaces Ramda with Lodash [#431](https://github.com/NYTimes/kyt/pull/431)
- Adds missing require statments to recipe docs [#415](https://github.com/NYTimes/kyt/pull/415) and [#410](https://github.com/NYTimes/kyt/pull/410)
- Fixes bug with build on windows where old build directory wasn't deleted [#429](https://github.com/NYTimes/kyt/pull/429)

## 0.4.1 (March 03, 2017)

### FEATURES

Adds server side source maps #402. You can remove `source-map-support` from your projects if you registered it in your server side code.

### BUGFIXES

Made `src/public` directory accessible in `noServer=true` projects #427.

Fixes autoprefixer bug where deprecated bugs were getting removed by the minimizer #390.


## 0.4.0 (February 13, 2017)

[0.3.x-0.4.0 Migration guide](/docs/migration-guides/0.3-0.4.md).

### BREAKING CHANGES

#### MONOREPO [#330](https://github.com/NYTimes/kyt/pull/330)
kyt is now a monorepo with several packages
1. kyt-cli - A globally installed package for project setup
  - setup command now can create a new project directory with the -d flag.
    `kyt-cli setup`
  - setup now supports copying devDependencies from starter-kyts
  - `setup` accepts a kyt version flag to help with local development [#343](https://github.com/NYTimes/kyt/pull/343)
  - kyt-cli includes a `list` command which lists information about supported and recommended starter-kyts [#340](https://github.com/NYTimes/kyt/pull/340)
2. kyt-core - The kyt build and dev systems. Used as a project dependency
  - `setup` is now deprecated as part of kyt-core. It can be found in kyt-cli
  - `start` now runs the node server without a kyt wrapped command. This means kyt can be installed as a dev dependency
3. kyt-utils - Shared kyt code. Not to be used independently
4. starter-kyts - kyt-starter-static and kyt-starter-universal now live in the kyt repo.

e2e tests have been pulled to the top level and will be used to test all packages.

#### Babel Presets [#347](https://github.com/NYTimes/kyt/pull/347)
kyt now supports having your own .babelrc file in your project.

kyt has two presets:
- [babel-preset-core] (/packages/babel-preset-kyt-core) included as the default for kyt
- [babel-preset-react] (/packages/babel-preset-kyt-react) included with react starter-kyts

To update an existing kyt project:
- If your project uses react you'll want to create a .babelrc that points to the react preset. [This one](/packages/kyt-starter-universal/.babelrc) should work.
- If you currently make babel plugin or preset changes via `modifyWebpackConfig`, checkout out the updated [recipe](/docs/Recipes.md)

#### Linter configs
kyt's linter configs are now packaged as separate configs [#344](https://github.com/NYTimes/kyt/pull/344)
[#380](https://github.com/NYTimes/kyt/pull/380)
To update: copy the new linter files into the root of your project.
[.eslintrc.json](/packages/kyt-cli/config/user/.eslintrc.base.json)
[.stylelintrc.json](/packages/kyt-cli/config/user/.stylelintrc.json)

#### New Lint commands [#339](https://github.com/NYTimes/kyt/pull/339)
Lint commands are now  as follows:
- `kyt lint-script` for JS
- `kyt lint-style` for CSS/Sass
- `npm run lint` runs both commands (installed by `kyt-cli` setup)
`kyt lint` is deprecated

#### `kyt start` is deprecated
`kyt-cli setup` creates an `npm run start` command to run the server

### FEATURES
- Support babel plugins w/o prefix [#303](https://github.com/NYTimes/kyt/issues/303)
- Bootstrap scripts for local development [#341](https://github.com/NYTimes/kyt/pull/341)
[#377](https://github.com/NYTimes/kyt/pull/377)
- kyt-cli now supports a fully interactive setup in addition to cli args. [#378](https://github.com/NYTimes/kyt/pull/378)

#### Yarn Support
kyt-cli now supports setting up projects using yarn.[#270](https://github.com/NYTimes/kyt/pull/270)


### Tooling updates
- Updated PostCSS loader [#295](https://github.com/NYTimes/kyt/pull/295)
- Add babel-plugin-transform-react-jsx-source to dev [#179](https://github.com/NYTimes/kyt/issues/179)
- Updated babel dependencies [#311](https://github.com/NYTimes/kyt/pull/311)
- Use babel polyfill rather than babel-transform-runtime [#255](https://github.com/NYTimes/kyt/pull/255)
- Updated linter dependencies [#289](https://github.com/NYTimes/kyt/pull/289)

### Bugfixes

- Fixes bug where e2e tests were silently failing [#326](https://github.com/NYTimes/kyt/pull/326)
- Fixes bug where test command wasn't written if an npm default existed [#293](https://github.com/NYTimes/kyt/pull/293)
- Catch SIGINT for all commands [#332](https://github.com/NYTimes/kyt/pull/332)
- Fixes bug where Jest moduleNameMappers didn't match imports with specific Webpack loaders [#363](https://github.com/NYTimes/kyt/pull/363)
- Fixes bug where style-lint only supported one file name [#383](https://github.com/NYTimes/kyt/pull/383)


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
