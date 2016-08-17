
const detect = require('detect-port');
const logger = require('./../cli/logger');

// Determines whethere the given port is in use
const isPortFree = (port, callBack) => {
  detect(port, function(error, unusedPort) {
    if (error) {
      logger.error('error attempting to detect port', error);
      process.exit();
    }
    if (port === unusedPort) {
      callBack();
    } else {
      logger.error(`port: ${port} is in use.`);
      logger.info('Ports can be configured in kyt.config.js');
      process.exit();
    }
  });
};

module.exports = isPortFree;
