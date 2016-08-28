#!/usr/bin/env node

// Surface any uncaught errors
process.on('uncaughtException', (error) => {
  const log = console;
  log.error('UNHANDLED EXCEPTION', error.stack);
  process.exit();
});

const path = require('path');

// define user root
process.env.USER_ROOT = path.resolve(process.cwd());

const exitIfOldNodeVersion = require('./../utils/exitIfOldNodeVersion');
const program = require('commander');
const devAction = require('./actions/dev');
const lintAction = require('./actions/lint');
const testAction = require('./actions/test');
const buildAction = require('./actions/build');
const runAction = require('./actions/run');
const protoAction = require('./actions/proto');
const setupAction = require('./actions/setup');
const lintStyleAction = require('./actions/lintStyle');
const loadConfigAndDo = require('./../utils/loadConfigAndDo');

exitIfOldNodeVersion();

program
  .command('lint')
  .description(`lint .js and .jsx files in the ./src directory.
    See more options: kyt lint --help
  `)
  .option('-d, --dir <dir-name>', `The default directory is ./src.
    If you want to lint your own, add a comma-delimited list.
      kyt lint -d src/,test/
  `)
  .action(() => loadConfigAndDo(lintAction, program));

program
  .command('dev')
  .description('Start an express server for development')
  .action(() => loadConfigAndDo(devAction, program));

program
  .command('build')
  .option('-C, --config <path>', 'config path')
  .description('Create a production build')
  .action(() => {
    let config = program.args[0].config ? program.args[0].config: null;
    loadConfigAndDo(buildAction, program, config);
  });

program
  .command('run')
  .description('Run the production build')
  .action(() => loadConfigAndDo(runAction, program));

program
  .command('setup')
  .description('Generate a project from a github url to get started.')
  .option('-r, --repository [address]', 'Github repository address')
  .action(() => loadConfigAndDo(setupAction, program));

program
  .command('test')
  .description('Run test files with Ava.')
  .action(() => loadConfigAndDo(testAction, program));

program
  .command('lint-style')
  .description('')
  .action(() => loadConfigAndDo(lintStyleAction, program));

program
  .command('proto')
  .description('Start a prorotype dev server.')
  .action(() => loadConfigAndDo(protoAction, program));


program.parse(process.argv);
