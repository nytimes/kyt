
// Command to run production code

const shell = require('shelljs');
const logger = require('./../logger');
const kytConfig = require('./../../utils/kytConfig');

module.exports = () => {
  logger.start('Starting production...');
  shell.exec('node build/server/main.js', { async: true });
  logger.end(`Server running at http://localhost:${kytConfig().serverPort}`);
};
