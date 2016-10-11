
// Command to lint src code

const shell = require('shelljs');
const path = require('path');
const logger = require('./../logger');
const glob = require('glob');
const { userRootPath } = require('../../utils/paths')();

module.exports = (config, flags) => {
  const eslintrc = glob.sync(`${userRootPath}/.*eslintrc*`);
  const configFile = eslintrc.length
      ? eslintrc[0]
      : path.join(__dirname, '../../config/.eslintrc.base.json');

  logger.info(`Using ESLint file: ${configFile}`);

  const lint = () => {
    const cmd = `eslint src/ -c ${configFile} --color --env browser ${flags.join(' ')}`;
    const output = shell.exec(cmd);
    if (output.code === 0) {
      logger.end(`Your JS looks ${output.stdout === '' ? 'great ✨' :
        'OK, though there were warnings 🤔👆'}`);
    }

    process.exit(output.code > 0 ? 1 : 0);
  };

  lint();
};
