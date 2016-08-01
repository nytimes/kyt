#!/usr/bin/env node

const program = require('commander');
const webpack = require('webpack');
const chalk = require('chalk');
const logger = console;
const temp = require('temp');
const fs = require('fs');
const path = require('path');

const initAction = require('./actions/init');
const startAction = require('./actions/start');
const lintAction = require('./actions/lint');
const testAction = require('./actions/test');
const updateAction = require('./actions/update');
const postAction = require('./actions/postinstall');
const buildAction = require('./actions/build');
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
  .command('start')
  .description('start an express server')
  .option('-p, --port [number]', 'Port to run kyt (Required)', parseInt)
  .option('-c, --config [dir-name]', 'File for kyt custom config')
  .option('--print-config', 'Debugs by printing out the full configuration')
  .action(() => startAction(program));

program
  .command('build')
  .description('create a production build')
  .action(() => buildAction(program));

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
