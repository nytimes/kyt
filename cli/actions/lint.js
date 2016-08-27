
// Command to lint src code

const path = require('path');
const CLIEngine = require('eslint').CLIEngine;
const shell = require('shelljs');
const logger = require('./../logger');
const kytConfig = require('./../../config/kyt.config');

module.exports = () => {
  // http://eslint.org/docs/developer-guide/nodejs-api
  const eslintCLI = {
    envs: ['browser', 'mocha'],
    extensions: ['.js', '.jsx'],
    useEslintrc: true,
  };

  // Get the default dir or the dir specified by the user/-d.
  const lint = () => {
    const files = ['src/'];
    const cli = new CLIEngine(eslintCLI);
    const report = cli.executeOnFiles(files);
    const formatter = cli.getFormatter();
    logger.log(formatter(report.results));
  };

  const esLintPath = path.join(kytConfig.userRootPath, './.eslintrc');

  // Check to see if eslint file exists
  if (!shell.test('-f', esLintPath)) {
    logger.error('You do not have an .eslintrc file');
    logger.info('Run "node_modules/.bin kyt setup" to get the default eslint config');
    process.exit();
  }
  lint();
};
