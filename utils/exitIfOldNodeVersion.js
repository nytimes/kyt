
const logger = require('./../cli/logger');

const minNodeVersion = 6;

// Returns whether node is version `minNodeVersion` or above
module.exports = () => {
  if (Number(process.versions.node.split('.')[0]) < minNodeVersion) {
    logger.error(`kyt requires Node v${minNodeVersion}+`);
    logger.info('Need to run multiple versions of node? Check out nvm');
    process.exit();
  }
};

