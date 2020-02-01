# kyt-cli

kyt-cli is a tool for creating new kyt projects. It installs starter-kyts and all the tools you need to begin development.

## Quickstart

```
npm install -g kyt-cli
```

```
kyt-cli setup
```

## commands

- `kyt-cli setup`
- `kyt-cli list`

### `setup` command

The `setup` command sets up your project with all the application files that you'll need to use kyt:

1. Creates a new [kyt.config.js](/docs/kytConfig.md)
2. Install necessary npm packages
3. Creates a .gitignore and .editorconfig
4. Creates linter configurations - .eslintrc.js files
5. Adds kyt commands to npm scripts

If kyt finds any files with duplicate names, it will back up your file before replacing it.

`kyt-cli setup` will take you through the process of setting up a new kyt project with a set of interactive questions. If you wish to automate this process you can use these optional flags:

- `-d` The name of the new project directory. If not specified kyt will install the project in your current working directory.
- `-r` The Github url for a starter-kyt. If not specified you will be prompted to select a starter-kyt from the supported list.
- `-k` For local development purposes, you can override the version of kyt to be installed by passing in a new version number or a file path eg. `file:../../my-local-kyt`
- `-p` The package manager to use, either `npm` or `yarn`. If not specified, defaults to `yarn` if it's installed globally, otherwise `npm` will be used.

kyt will provide you with a list of supported starter-kyts to install. The supported starter-kyts are:

- [kyt-starter-universal](/packages/kyt-starter-universal)
- [kyt-starter-static](/packages/kyt-starter-static)

## `list` command

The `list` command lists the supported and recommended starter-kyts.
It includes:

- A description of best use cases
- Installation instructions

`kyt-cli list`

### Recommended starter-kyts

#### [Universal React starter-kyt](/packages/kyt-starter-universal)

This default starter-kyt is a good base for building advanced, universal React apps.

## Setup a new project

`kyt-cli setup`

#### [Static starter-kyt](/packages/kyt-starter-static)

`kyt-cli setup`
Select `I have my own url` when prompted to set up a starter-kyt

## Setup an existing project

Run `kyt-cli setup` in your project directory.
Select `I don't want a starter-kyt` when prompted to setup.

## See a list of supported starter-kyts

`kyt-cli list`

## [Changelog](/packages/kyt-cli/CHANGELOG.md)
