
const stylelint = require('stylelint');
const logger = require('./../logger');
const glob = require('glob');
const { userRootPath } = require('../../utils/paths')();

module.exports = () => {
  // Check to see if stylelint file exists
  const stylelintrc = glob.sync(`${userRootPath}/.stylelintrc`);
  if (!stylelintrc.length) {
    logger.error('You do not have a .stylelintrc file in the root of your project');
    process.exit();
  }

  stylelint.lint({
    files: [`${userRootPath}/src/**/*.css`, `${userRootPath}/src/**/*.scss`],
    formatter: 'string',
  })
  .then((result) => {
    if (result.output) {
      logger.log(result.output);
    } else {
      logger.log('');
      logger.end('Your styles look good! ✨\n');
    }
  })
  .catch((err) => {
    logger.error(err.stack);
  });
};
