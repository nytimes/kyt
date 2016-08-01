#!/usr/bin/env node

const program = require('commander');
const webpack = require('webpack');
const chalk = require('chalk');
const logger = console;
const temp = require('temp');
const fs = require('fs');
const path = require('path');

const initAction = require('./actions/init');
const devAction = require('./actions/dev');
const lintAction = require('./actions/lint');
const testAction = require('./actions/test');
const updateAction = require('./actions/update');
const postAction = require('./actions/postinstall');
const buildAction = require('./actions/build');
const runAction = require('./actions/run');
// const protoAction = require('./actions/proto');

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
  .option('-p, --port [number]', 'Port to run kyt (Required)', parseInt)
  .option('-c, --config [dir-name]', 'File for kyt custom config')
  .option('-v, --verbose ', 'Verbose output')
  .action(() => devAction(program));

program
  .command('build')
  .description('create a production build')
  .option('-v, --verbose ', 'Verbose output')
  .action(() => buildAction(program));

program
  .command('run')
  .description('run the production build')
  .option('-v, --verbose ', 'Verbose output')
  .action(() => runAction(program));

program
  .command('test')
  .description('run test files')
  .action(() => testAction(program));

program
  .command('init')
  .description('Initializes directories and files for an app.')
  .action(() => initAction(program));

program
  .command('update')
  .description('Updates directories and files for an app.')
  .action(() => updateAction(program));

program
  .command('postinstall')
  .description('Initializes directories and files for an app.')
  .action(() => postAction(program));

// program
//   .command('proto')
//   .description('Starts a prorotype dev server. See proto.js')
//   .option('-p, --port [number]', 'Port to run kyt (Required)', parseInt)
//   .option('-c, --config [dir-name]', 'File for kyt custom config')
//   .option('--print-config', 'Debugs by printing out the full configuration')
//   .action(() => protoAction(program));


program.parse(process.argv);
