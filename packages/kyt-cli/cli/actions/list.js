const logger = require('kyt-utils/logger');
const starterKyts = require('../../config/starterKyts');

const { log } = console; // eslint-disable-line no-console

const printStarter = (li, starter) => {
  log(`${li}. The ${starter.displayName} starter-kyt:`);
  log(`   ${starter.description}`);
  log('    ℹ️  To install this starter-kyt: ');
  log(`       ${starter.install}`);
  log('\n');
};

module.exports = () => {
  logger.start('Listing starter-kyts');
  logger.task('kyt supported starter-kyts: \n');
  Object.keys(starterKyts.supported).forEach((starterName, index) => {
    const li = index + 1;
    printStarter(li, starterKyts.supported[starterName]);
  });
  logger.end('List complete');
};
