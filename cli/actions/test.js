const chalk = require('chalk');
const logger = console;
const path = require('path');
const shell = require('shelljs');

module.exports = (program) => {
  console.log(chalk.blue('Running Tests'));
  shell.exec('BABEL_DISABLE_CACHE=1 node node_modules/ava/cli.js --verbose');
};
