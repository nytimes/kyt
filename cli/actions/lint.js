
// Command to lint src code

const CLIEngine = require('eslint').CLIEngine;
const logger = require('./../logger');
const glob = require('glob');
const { userRootPath } = require('../../utils/paths')();

module.exports = () => {
  // http://eslint.org/docs/developer-guide/nodejs-api
  const eslintCLI = {
    envs: ['browser'],
    extensions: ['.js'],
    useEslintrc: true,
  };

  // Get the default dir or the dir specified by the user/-d.
  const lint = () => {
    const files = ['src/'];
    const cli = new CLIEngine(eslintCLI);
    const report = cli.executeOnFiles(files);
    const formatter = cli.getFormatter();
    logger.log(`${formatter(report.results)}\n`);
    if (report.errorCount === 0) {
      logger.end('Your JS looks good ✨');
    }
    process.exit(report.errorCount + report.warningCount > 0 ? 1 : 0);
  };

  // Check to see if eslint file exists
  const eslintrc = glob.sync(`${userRootPath}/.*eslintrc*`);
  if (!eslintrc.length) {
    logger.error('You do not have an eslintrc file in the root of your project');
    process.exit(1);
  }

  lint();
};
