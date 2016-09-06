#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const devAction = require('./actions/dev');
const lintAction = require('./actions/lint');
const testAction = require('./actions/test');
const buildAction = require('./actions/build');
const runAction = require('./actions/run');
const protoAction = require('./actions/proto');
const setupAction = require('./actions/setup');
const lintStyleAction = require('./actions/lintStyle');
const kytConfigFn = require('./../utils/kytConfig');
const logger = require('./logger');
const { userPackageJSONPath } = require('../utils/paths')();

// Check if the user ran the command from the root
// of their project. If not, shut the process down.
if (!shell.test('-f', userPackageJSONPath)) {
  logger.error(`kyt works best when you execute commands
    from the root of your project where kyt is installed.`);
  process.exit();
}

const loadConfigAndDo = (callback, optionalConfig) => {
  kytConfigFn(optionalConfig);
  callback(program);
};

program
  .command('lint')
  .description(`lint .js and .jsx files in the ./src directory.
    See more options: kyt lint --help
  `)
  .option('-d, --dir <dir-name>', `The default directory is ./src.
    If you want to lint your own, add a comma-delimited list.
      kyt lint -d src/,test/
  `)
  .action(() => loadConfigAndDo(lintAction));

program
  .command('dev')
  .description('Start an express server for development')
  .action(() => loadConfigAndDo(devAction));

program
  .command('build')
  .option('-C, --config <path>', 'config path')
  .description('Create a production build')
  .action(() => {
    const config = program.args[0].config ? program.args[0].config : null;
    loadConfigAndDo(buildAction, config);
  });

program
  .command('run')
  .description('Run the production build')
  .action(() => loadConfigAndDo(runAction));

program
  .command('setup')
  .description('Generate a project from a github url to get started.')
  .option('-r, --repository [address]', 'Github repository address')
  .action(() => loadConfigAndDo(setupAction));

program
  .command('test')
  .description('Run test files with Ava.')
  .action(() => loadConfigAndDo(testAction));

program
  .command('lint-style')
  .description('')
  .action(() => loadConfigAndDo(lintStyleAction));

program
  .command('proto')
  .description('Start a prorotype dev server.')
  .action(() => loadConfigAndDo(protoAction));


program.parse(process.argv);
