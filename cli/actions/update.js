var initAction = require('./init.js');
const chalk = require('chalk');
const logger = console;
module.exports = (program) => {
  logger.log(chalk.green('Updating src/ ...'))
  initAction(program);
};
