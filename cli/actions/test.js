
// Command to run tests with Ava

const logger = require('./../logger');
const shell = require('shelljs');
const kytConfig = require('./../../config/kyt.config');

module.exports = () => {
  logger.start('Running Tests...');
  let command = 'BABEL_DISABLE_CACHE=1 NODE_ENV=TEST node node_modules/ava/cli.js';
  if (kytConfig.debug) {
    command += ' --verbose';
  }
  shell.exec(command);
};
