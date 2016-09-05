
const stylelint = require('stylelint');
const logger = require('./../logger');
const glob = require('glob');
const { userRootPath } = require('../../utils/paths')();

module.exports = () => {
  const handleError = (error) => {
    logger.error(error);
    process.exit(1);
  };

  // Check to see if stylelint file exists
  const stylelintrc = glob.sync(`${userRootPath}/.stylelintrc`);
  if (!stylelintrc.length) {
    handleError('You do not have a .stylelintrc file in the root of your project');
  }

  stylelint.lint({
    files: [`${userRootPath}/src/**/*.css`, `${userRootPath}/src/**/*.scss`],
    formatter: 'string',
  })
  .then((result) => {
    if (result.output) {
      handleError(`\n${result.output}`);
    } else {
      logger.log('');
      logger.end('Your styles look good! ✨\n');
      process.exit(0);
    }
  })
  .catch((error) => {
    handleError(error.stack);
  });
};
