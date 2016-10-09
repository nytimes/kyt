
// Command to run production code

const shell = require('shelljs');
const logger = require('./../logger');

module.exports = (config, flags) => {
  logger.start('Starting production...');
  const cmd = `node build/server/main.js ${flags.join(' ')}`;
  shell.exec(cmd, { async: true });
  logger.end(`Server running at ${config.serverURL.href}`);
};
