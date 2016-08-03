const logger = require('../logger');
const path = require('path');
const shell = require('shelljs');
const kytConfig = require('../../config/kyt.config.js');

module.exports = (program) => {
  logger.start('Running Tests');
  const command = 'BABEL_DISABLE_CACHE=1 node node_modules/ava/cli.js';
  if(kytConfig.debug) {
    command = command + ' --verbose';
  }
  shell.exec(command);
};
