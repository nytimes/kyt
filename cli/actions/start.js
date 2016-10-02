
// Command to run production code

const shell = require('shelljs');
const logger = require('./../logger');

module.exports = (config) => {
  logger.start('Starting production...');
  shell.exec('node build/server/main.js', { async: true });
  logger.task(`Server running on ${config.serverURL.href}`);
  logger.end(`Production started`);
};
