
// Command to run production server

const shell = require('shelljs');
const logger = require('./../logger');

// we ignore the return value; it's just a convenience to
// prevent the code from reaching a line later that would
// cause a ReferenceError
// eslint-disable-next-line consistent-return
module.exports = (config, flags) => {
  if (!config.hasServer) {
    logger.error('You have hasServer set to false, bailing');
    return process.exit(1);
  }

  logger.start('Starting production server...');
  const cmd = `node build/server/main.js ${flags.join(' ')}`;
  shell.exec(cmd, { async: true });
  logger.task(`Server running on ${config.serverURL.href}`);
  logger.end('Production started');
};
