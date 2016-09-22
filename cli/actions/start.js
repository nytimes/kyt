
// Command to run production server

const shell = require('shelljs');
const logger = require('./../logger');

module.exports = (config) => {
  if (config.noServer) {
    logger.error('You have noServer set to true, bailing');
    return process.exit(1);
  }

  logger.start('Starting production server...');
  shell.exec('node build/server/main.js', { async: true });
  logger.end(`Server running at ${config.serverURL.href}`);
};
