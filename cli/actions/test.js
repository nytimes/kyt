const chalk = require('chalk');
const logger = console;
const path = require('path');
const shell = require('shelljs');

module.exports = (program) => {
  console.log(chalk.blue('Running Tests'));
  shell.exec('CONFIG=$(pwd)/config/webpack.test.config.js BABEL_DISABLE_CACHE=1 NODE_ENV=TEST node node_modules/ava/cli.js --verbose');
};
