const logger = require('../logger');
const path = require('path');
const shell = require('shelljs');

module.exports = (program) => {
  const args = program.args[0];
  if(args.verbose) {
    process.env.debug = true;
  }
  logger.start('Running Tests');
  shell.exec('BABEL_DISABLE_CACHE=1 node node_modules/ava/cli.js --verbose');
};
