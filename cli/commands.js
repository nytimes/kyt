#!/usr/bin/env node

const program = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const configBuilder = require('../configBuilder');
const chalk = require('chalk');
const logger = console;
const temp = require('temp');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const initAction = require('./actions/init');
const startAction = require('./actions/start');
const lintAction = require('./actions/lint');
const testAction = require('./actions/test');
const updateAction = require('./actions/update');

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
  .option('-p, --port [number]', 'Port to run starter-kit (Required)', parseInt)
  .option('-c, --config [dir-name]', 'File for starter-kit config')
  .option('--print-config', 'Debugs by printing out the full configuration')
  .action(() => startAction(program));

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

// program
//   .command('proto')
//   .description('start a prototype server with webpack')
//   .option('-p, --port [number]', 'Port to run starter-kit (Required)', parseInt)
//   .option('-c, --config [dir-name]', 'File for starter-kit config')
//   .option('--print-config', 'Debugs by printing out the full configuration')
//   .action(() => {
//     const args = program.args[0];
//     const defaultPort = 3333;
//     const port = args.port ? args.port : defaultPort;
//     const options = {
//       port,
//       proto: true,
//       environment: process.env.NODE_ENV || 'development'
//     };

//     const config = configBuilder(args.config || '', options);

//     // Optional Flag to print config for debugging
//     if (args.printConfig) {
//       logger.log(chalk.blue(config), { depth: 8 });
//     } else {
//       /*
//        * Creates a webpack dev server at the specified port
//       */
//       const compiler = webpack(config);
//       const server = new WebpackDevServer(compiler, config.devServer);

//       server.listen(port, 'localhost', () => {
//         logger.log(chalk.green('webpack-dev-server http://localhost:%d/', port));
//       });
//     }
//   });

program.parse(process.argv);
