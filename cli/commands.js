#!/usr/bin/env node

process.on('uncaughtException', function(error) {
  console.error("UNHANDLED EXCEPTION", error.stack);
  process.exit();
});

const path = require('path');
process.env.USER_ROOT = path.resolve(process.cwd());
const program = require('commander');
const devAction = require('./actions/dev');
const lintAction = require('./actions/lint');
const testAction = require('./actions/test');
const buildAction = require('./actions/build');
const runAction = require('./actions/run');
const protoAction = require('./actions/proto');
const setupAction = require('./actions/setup');

program
  .command('lint')
  .description(`lint .js and .jsx files in the ./src directory.
    See more options: kyt lint --help
  `)
  .option('-d, --dir <dir-name>', `The default directory is ./src.
    If you want to lint your own, add a comma-delimited list.
      kyt lint -d src/,test/
  `)
  .action(() => lintAction(program));

program
  .command('dev')
  .description('Start an express server for development')
  .action(() => devAction(program));

program
  .command('build')
  .description('Create a production build')
  .action(() => buildAction(program));

program
  .command('run')
  .description('Run the production build')
  .action(() => runAction(program));

program
  .command('setup')
  .description('Generate a project from a github url to get started.')
  .option('-r, --repository [address]', 'Github repository address')
  .action(() => setupAction(program));

program
  .command('test')
  .description('Run test files with Ava.')
  .action(() => testAction(program));

program
  .command('proto')
  .description('Start a prorotype dev server.')
  .action(() => protoAction(program));


program.parse(process.argv);
