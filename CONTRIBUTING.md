# How to Contribute to kyt

## Contribute to open issues

We're looking for developers to help maintain `kyt`.
See something you think we should address? Open an issue.

### Submitting a PR

Please make sure all PRs are:

1. linted (`yarn lint`)
1. tested (`yarn test`)
1. Connected to an issue
1. Update the [CHANGELOG](/CHANGELOG.md) (for MASTER) to reflect your PR changes.

### Create an RFC

If you want to propose a large feature idea or architecture change you should consider submitting an RFC. It's often helpful to get feedback on your concept in an issue before starting the RFC. RFCs are an evolving process in the `kyt` repository so expect a lot of changes and guidelines in the future. You can find the `kyt` RFC template [here](/rfc/template.md).

## kyt local development workflow

1. Fork and clone `kyt`
1. [setup [mise](https://mise.jdx.dev/) and `mise install`]
1. Run `yarn bootstrap` to install the packages in the monorepo
1. Open a new shell and run `yarn watch`

Most changes are best to develop against the universal starter kyt:

1. `cd packages/kyt-starter-universal/starter-src`
1. Run `yarn dev` or `yarn build` to test against kyt development and production builds

Note: After you make changes, the watcher will update libraries but you will likely have to restart the universal app process to test changes. The watcher only works against kyt-core, server and runtime. Changes to babel presets and a few other packages may require you to re-`yarn bootstrap` or `yarn clean-bootstrap`. When in doubt run `yarn clean-bootstrap`.

[lerna](https://github.com/lerna/lerna) is used to manage the monorepo but most of the development commands should be exercised through root directory `package.json` scripts.

### bootstrap

`bootstrap` will install `node_modules` (hoisting most dependencies to the root `node_modules` directory) across all of the packages and symlink local package dependencies. Starter `kyt` sources (`starter-src/`) are fully installed (not hoisted) and `kyt` is linked.

From the root of `kyt`, run:

`yarn bootstrap`

### clean-bootstrap

`clean-bootstrap` is useful after you make or pull down `kyt` with dependency changes. It will remove `node_modules` directories before calling `bootstrap`.

From the root of `kyt`, run:

`yarn clean-bootstrap`

### Test

Unit tests for all packages in the monorepo can be run from the root of the repository: `yarn test`.

Similarly, e2e tests, located in the `e2e` directory can be run from the root of the repository: `yarn e2e`

### Lint

The monorepo has a top level `lint` command which runs lint for all the packages: `yarn lint`

## Build a `starter-kyt`

Have a great idea for a boilerplate? Build it on top of `kyt` and let us know about it. Directions are [here](/docs/Starterkyts.md).

## Publishing to `npm`

!!! warning You _must_ use `npm` to publish, rather than `yarn`.

In order to publish to `npm`, you _must_ use `npm` to publish (instead of
`yarn`). In order for the various command line utilities that are used to work,
you must publish using the provided `publish` script in `package.json`.

This can be accomplished with the following command:

```sh
$ GH_TOKEN=$GITHUB_TOKEN npm run publish
```

`npm run publish` will push a new commit to the current branch, so _it is
recommended to branch off of `main` prior to doing a new release_ to avoid
pushing directly to `main`.

For more information on using `lerna` to publish, see [the `lerna publish`
documentation](https://github.com/lerna/lerna/tree/main/commands/publish#readme).

### Development Versions

If you would like your prerelease to have the `next` dist tag, rather than
`latest`, such as when creating a release candidate or testing a development
version, you can use the provided `publish:next` script.

```sh
$ GH_TOKEN=$GITHUB_TOKEN npm run publish:next
```

If you need more functionality than this, it is recommended that you pass your
own parameters to the `npm run publish` command, that will be included in the
flags/arguments to the `lerna publish` command.
