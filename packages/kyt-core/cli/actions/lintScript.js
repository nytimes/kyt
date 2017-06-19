// Command to lint src code

const shell = require('shelljs');
const path = require('path');
const logger = require('kyt-utils/logger');
const glob = require('glob');
const { userRootPath } = require('kyt-utils/paths')();

module.exports = (config, flags) => {
  const eslintrc = glob.sync(`${userRootPath}/.*eslintrc*`);
  const configFile = eslintrc.length
    ? eslintrc[0]
    : path.join(__dirname, '../../config/.eslintrc.base.json');

  logger.info(`Using ESLint file: ${configFile}`);

  const lint = () => {
    shell.config.silent = false;
    const eslintLib = require.resolve('eslint');
    const eslint = eslintLib.replace(/(.*)(lib\/api\.js)/, '$1bin/eslint.js');
    const sources = 'src/ kyt.config.js package.json';
    const userFlags = `${flags.join(' ')}`;
    const extensions = '--ext .js --ext .json';

    const cmd = `${eslint} ${sources} -c ${configFile} --color ${userFlags} ${extensions}`;
    const output = shell.exec(cmd);
    if (output.code === 0) {
      logger.end(
        `Your JS looks ${output.stdout === '' ? 'great ✨' : 'OK, though there were warnings 🤔👆'}`
      );
    }

    process.exit(output.code > 0 ? 1 : 0);
  };

  lint();
};
