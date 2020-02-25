# How to Contribute to kyt

## Contribute to open issues

We're looking for developers to help maintain `kyt`.
See something you think we should address? Open an issue.

### Submitting a PR

Please make sure all PRs are:

1. linted (`npm run lint`)
1. tested (`npm t`)
1. Connected to an issue
1. Update the [CHANGELOG](/CHANGELOG.md) (for MASTER) to reflect your PR changes.

### Create an RFC

If you want to propose a large feature idea or architecture change you should consider submitting an RFC. It's often helpful to get feedback on your concept in an issue before starting the RFC. RFCs are an evolving process in the `kyt` repository so expect a lot of changes and guidelines in the future. You can find the `kyt` RFC template [here](/rfc/template.md).

## kyt local development

1. `nvm use`
1. Fork and clone `kyt`
1. Run `npm run bootstrap` to install the packages in the monorepo

[lerna](https://github.com/lerna/lerna) is used to manage the monorepo but most of the development commands should be exercised through root directory `package.json` scripts. The following are some useful npm scripts for development:

### bootstrap

`bootstrap` will install `node_modules` (hoisting most dependencies to the root `node_modules` directory) across all of the packages and symlink local package dependencies. Starter `kyt` sources (`starter-src/`) are fully installed (not hoisted) and `kyt` is linked.

From the root of `kyt`, run:

`npm run bootstrap`

### clean-bootstrap

`clean-bootstrap` is useful after you make or pull down `kyt` with dependency changes. It will remove `node_modules` directories before calling `bootstrap`.

From the root of `kyt`, run:

`npm run clean-bootstrap`

### Test

Unit tests for all packages in the monorepo can be run from the root of the repository: `npm t`.

Similarly, e2e tests, located in the `e2e` directory can be run from the root of the repository: `npm run e2e`

### Lint

The monorepo has a top level `lint` command which runs lint for all the packages: `npm run lint`

## Build a `starter-kyt`

Have a great idea for a boilerplate? Build it on top of `kyt` and let us know about it. Directions are [here](/docs/Starterkyts.md).
