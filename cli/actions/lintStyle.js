
const stylelint = require('stylelint');
const logger = require('./../logger');
const glob = require('glob');
const path = require('path');
const { userRootPath } = require('../../utils/paths')();

module.exports = () => {
  const handleError = (error) => {
    logger.error(error);
    process.exit(1);
  };

  // Check to see if stylelint file exists and use base config as a backup.
  const stylelintrc = glob.sync(`${userRootPath}/.stylelintrc.json`);
  const configFile = stylelintrc.length
      ? stylelintrc[0]
      : path.join(__dirname, '../../config/.stylelintrc.base.json');

  logger.info(`Using Stylelint file: ${configFile}`);

  stylelint.lint({
    files: [`${userRootPath}/src/**/*.css`, `${userRootPath}/src/**/*.scss`],
    formatter: 'string',
    configFile,
  })
  .then((result) => {
    if (result.output) {
      handleError(`\n${result.output}`);
    } else {
      logger.end('Your styles look good! ✨');
      process.exit(0);
    }
  })
  .catch((error) => {
    handleError(error.stack);
  });
};
