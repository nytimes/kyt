
// Command to lint src code

const path = require('path');
const CLIEngine = require('eslint').CLIEngine;
const temp = require('temp');
const fs = require('fs');
const merge = require('ramda').merge;
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

  // In order to support merging a local configFile/eslint.json,
  // we need to save the result of the merge to a temp file
  // and point to that. Otherwise, we just use our config.
  if (kytConfig.eslintConfig) {
    const config = getConfig(kytConfig.eslintConfig);
    temp.open('temp-eslintrc-', (error, info) => {
      if (!error) {
        fs.write(info.fd, JSON.stringify(config));
        fs.close(info.fd, logger.error);
        eslintCLI.configFile = info.path;
        lint();
        temp.cleanupSync();
        logger.info('Using eslint config override');
      } else {
        logger.error('Error with user eslint config', error);
      }
    });
  } else {
    eslintCLI.configFile = path.join(__dirname, '../../eslint.json');
    lint();
  }
};
