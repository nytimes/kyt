
// Command to lint src code

const path = require('path');
const CLIEngine = require('eslint').CLIEngine;
const temp = require('temp');
const fs = require('fs');
const merge = require('ramda').merge;
const shell = require('shelljs');
const logger = require('./../logger');
const kytConfig = require('./../../config/kyt.config');
const baseConfig = require('./../../eslint.json');

module.exports = () => {
  const userRootPath = kytConfig.userRootPath;

  const getConfig = (configPath) => {
    const configFile = path.join(userRootPath, configPath);

    if (fs.existsSync(configFile)) {
      // eslint-disable-next-line
      const customConfig = require(configFile);
      return merge(baseConfig, customConfig);
    }

    return baseConfig;
  };

  // http://eslint.org/docs/developer-guide/nodejs-api
  const eslintCLI = {
    envs: ['browser', 'mocha'],
    extensions: ['.js', '.jsx'],
    useEslintrc: false,
  };

  // Get the default dir or the dir specified by the user/-d.
  const lint = () => {
    const files = ['src/'];
    const cli = new CLIEngine(eslintCLI);
    const report = cli.executeOnFiles(files);
    const formatter = cli.getFormatter();
    logger.log(formatter(report.results));
  };

    const esLintPath = path.join(kytConfig.userRootPath, './eslint.json');

    // Check to see if eslint file exists
    if (!shell.test('-f', esLintPath)) {
      logger.error('You do not have an esLint File');
      logger.info('Run node_modules/.bin kyt setup to get the default eslint config');
      process.exit();
    }
    eslintCLI.configFile = esLintPath;
    lint();
};
