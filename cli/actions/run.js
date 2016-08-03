
const shell = require('shelljs');
const logger = require('../logger');

module.exports = (program) => {

  logger.start('🔥  Starting production...');
  shell.exec('node build/server/main.js');
};
