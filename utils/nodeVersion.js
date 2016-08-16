
const logger = require('./../cli/logger');

// Returns where node is version 6 or above
module.exports = () => {
  if (Number(process.versions.node.split('.')[0]) < 6) {
    logger.error('kyt requires Node v6+');
    logger.info('Need to run multiple versions of node? Check out nvm');
    return false;
  }
  return true;
};

