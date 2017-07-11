const detect = require('detect-port');
const logger = require('kyt-utils/logger');

// Determines whethere the given port is in use
const ifPortIsFreeDo = (port, callback) => {
  detect(port, (error, unusedPort) => {
    if (error) {
      logger.error('error attempting to detect port', error);
      process.exit();
    }

    if (port === unusedPort) {
      callback();
    } else {
      logger.error(`port: ${port} is in use.`);
      logger.info('Ports can be configured in kyt.config.js');
      process.exit();
    }
  });
};

module.exports = ifPortIsFreeDo;
