
const stylelint = require('stylelint');
const logger = require('./../logger');

module.exports = () => {
  const userRootPath = global.config.userRootPath;

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
