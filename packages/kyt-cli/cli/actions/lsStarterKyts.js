const starterKyts = require('../../config/starterKyts');
const logger = require('kyt-utils/logger');

const log = console.log;

module.exports = () => {
  logger.start('Listing supported starter-kyts');
  Object.keys(starterKyts).forEach((starter, index) => {
    const li = index + 1;
    log(`${li}. The ${starter} starter-kyt:`);
    log(`   ${starterKyts[starter].description}`);
    log('\n');
  });
  logger.info('You can install these starter-kyts with kyt-cli setup');
  logger.end('List complete');
};
