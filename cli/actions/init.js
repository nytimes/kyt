
const chalk = require('chalk');
const logger = console;
const path = require('path');
const shell = require('shelljs');

module.exports = (program) => {
  // Comment the following if you want
  // to see the verbose command ouput.
  shell.config.silent = true;

  // Create a symbolic link from our local .babelrc
  // to the project's main directory.
  const babelrcPath = path.resolve(__dirname, '../../.babelrc');
  const linkedPath = path.join(process.cwd(), '.babelrc');
  if (shell.ln('-s', babelrcPath, linkedPath).code === 0) {
    logger.log(chalk.green('Linked .babelrc'));
  }

  // Create a symbolic link from our local .editorconfig
  // to the project's main directory.
  const editorPath = path.resolve(__dirname, '../../.editorconfig');
  const configPath = path.join(process.cwd(), '.editorconfig');
  if (shell.ln('-s', editorPath, configPath).code === 0) {
    logger.log(chalk.green('Linked .editorconfig'));
  }

  // Create a src directory with app files.
  if (shell.ls('src').code !== 0) {
    const index = path.resolve(__dirname, '../../src');
    shell.exec(`cp -rf ${index} .`);
    logger.log(chalk.green('Created src directory with application files.'));
  } else {
    logger.log(chalk.blue('src directory already exists. Doing nothing...'));
  }

};
