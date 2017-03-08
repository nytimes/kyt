const starterKyts = require('../../config/starterKyts');
const logger = require('kyt-utils/logger');

const log = console.log;

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
  logger.task('Recommended starter-kyts:\n');
  Object.keys(starterKyts.recommended).forEach((starterName, index) => {
    const li = index + 1;
    printStarter(li, starterKyts.recommended[starterName]);
  });
  logger.end('List complete');
};
