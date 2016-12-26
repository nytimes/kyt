# How to Contribute to kyt

## Contribute to open issues

We're looking for developers to help maintain kyt.
See something you think we should address? Open an issue.

### Submitting a PR
Please make sure all PRs are:

1. linted (npm run lint)
2. tested (npm test)
3. Connected to an issue

### kyt local development

1. Fork and clone kyt
2. Run `npm run bootstrap` to install the packages in the monorepo. You can also run `update` to reinstall.

We recommend creating a local project with a starter-kyt for testing.

### Testing kyt
The top level `test` command can be run from the root of the repository and will run all jest tests in the packages.

The e2e tests are located in the e2e folder and can be run from the root of the repo with `npm run e2e`

## Linting kyt
The monorepo has a top level `lint` command which runs lint for all the packages.

## Create an RFC

If you want to propose a large feature idea or architecture change you should consider submitting an RFC. It's often helpful to get feedback on your concept in an issue before starting the RFC. RFCs are an evolving process in the kyt repository so expect a lot of changes and guidelines in the future. You can find the kyt RFC template [here](/rfc/template.md).

## Build a starter-kyt

Have a great idea for a boilerplate? Build it on top of kyt and let us know about it. Directions are [here](/docs/Starterkyts.md).
We feature [recommended starter-kyts](/docs/commands.md#recommended-starter-kyts)
