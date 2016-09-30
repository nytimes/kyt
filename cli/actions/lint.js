
// Command to lint src code

const CLIEngine = require('eslint').CLIEngine;
const path = require('path');
const logger = require('./../logger');
const glob = require('glob');
const { userRootPath } = require('../../utils/paths')();

module.exports = () => {
  const eslintrc = glob.sync(`${userRootPath}/.*eslintrc*`);
  const configFile = eslintrc.length
      ? eslintrc[0]
      : path.join(__dirname, '../../config/.eslintrc.base.json');

  logger.info(`Using ESLint file: ${configFile}`);

  // http://eslint.org/docs/developer-guide/nodejs-api
  const eslintCLI = {
    envs: ['browser'],
    extensions: ['.js'],
    useEslintrc: true,
    configFile,
  };

  // Get the default dir or the dir specified by the user/-d.
  const lint = () => {
    const files = ['src/'];
    const cli = new CLIEngine(eslintCLI);
    const report = cli.executeOnFiles(files);
    const formatter = cli.getFormatter();
    logger.log(`${formatter(report.results)}\n`);

    if (report.errorCount === 0) {
      logger.end(`Your JS looks ${report.warningCount === 0 ? 'great ✨' :
        'OK, though there were warnings 🤔👆'}`);
    }

    process.exit(report.errorCount > 0 ? 1 : 0);
  };

  lint();
};
