#!/usr/bin/env node

const program = require('commander');
const devAction = require('./actions/dev');
const lintAction = require('./actions/lint');
const testAction = require('./actions/test');
const postAction = require('./actions/postinstall');
const buildAction = require('./actions/build');
const runAction = require('./actions/run');
const protoAction = require('./actions/proto');

program
  .command('lint')
  .description(`lint .js and .jsx files in the ./src directory.
    See more options: kyt lint --help
  `)
  .option('-f, --config-file [filemane]', `use a local eslint file to override or add rules.
    kyt lint -f eslint.json
  `)
  .option('-d, --dir <dir-name>', `The default directory is ./src.
    If you want to lint your own, add a comma-delimited list.
      kyt lint -d src/,test/
  `)
  .action(() => lintAction(program));

program
  .command('dev')
  .description('start an express server for development')
  .option('-c, --config [dir-name]', 'File for kyt custom config')
  .action(() => devAction(program));

program
  .command('build')
  .description('create a production build')
  .action(() => buildAction(program));

program
  .command('run')
  .description('run the production build')
  .action(() => runAction(program));

program
  .command('test')
  .description('run test files')
  .action(() => testAction(program));

program
  .command('postinstall')
  .description('Initializes directories and files for an app.')
  .action(() => postAction(program));

program
  .command('proto')
  .description('Starts a prorotype dev server. See proto.js')
  .action(() => protoAction(program));


program.parse(process.argv);
