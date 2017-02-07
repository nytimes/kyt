# How to Contribute to kyt

## Contribute to open issues

We're looking for developers to help maintain kyt.
See something you think we should address? Open an issue.

### Submitting a PR

Please make sure all PRs are:

1. linted (npm run lint)
2. tested (npm test)
3. Connected to an issue

## Create an RFC

If you want to propose a large feature idea or architecture change you should consider submitting an RFC. It's often helpful to get feedback on your concept in an issue before starting the RFC. RFCs are an evolving process in the kyt repository so expect a lot of changes and guidelines in the future. You can find the kyt RFC template [here](/rfc/template.md).

## Build a starter-kyt

Have a great idea for a boilerplate? Build it on top of kyt and let us know about it. Directions are [here](/docs/Starterkyts.md).
We feature [recommended starter-kyts](/docs/commands.md#recommended-starter-kyts)

## kyt local development

To setup kyt for local development, install `yarn` and run the following:

```
git clone git@github.com:NYTimes/kyt.git
yarn run bootstrap
```
There are commands for bootstrapping, testing and linting all of the monorepo packages in the root directory package.json file. 

### bootstrap

Bootstrap will set you up with a clean slate. Every time it is run, it will remove and re-install the node_modules across all of the packages, npm link `kyt-cli` and `kyt` so you can run them locally on the command line, and symlink local monorepo dependencies..

From the root of kyt, run:

`yarn run bootstrap`

### update

Update is useful after you pull down kyt with some minor changes. It will call `npm install` on all of the packages in the repository. For complicated changes to the repository, it is best to use `bootstrap`.

From the root of kyt, run:

`yarn run update`

### Testing local kyt-core changes

It is a common workflow to make changes to kyt-core and test them with `kyt-cli setup`. To get around installing the latest kyt-core, there's an option in setup where you can specify which version of kyt you want to reference. For instance, by executing the following locally, you can setup a directory called test and install your local version of kyt-core:

`kyt-cli setup -d test -k file:../kyt/packages/kyt-core`

### Testing local starter-kyt changes

To test setting up/installing local starter kyts, you need to specify the `--repository-path` option. The following command will create a test directory and install the given local kyt repository and reference the starter kyt using the given repository path.

`kyt-cli setup -d test -r kyt/.git --repository-path packages/kyt-starter-static`

### Testing kyt

More instructions TK
