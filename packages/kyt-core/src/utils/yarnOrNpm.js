// Checks to see if yarn is installed or not
const shell = require('shelljs');

module.exports = () => {
  const prevSilent = shell.config.silent;
  shell.config.silent = true;
  const isYarnInstalled = shell.exec('yarn --version').code === 0;
  shell.config.silent = prevSilent;

  return isYarnInstalled ? 'yarn' : 'npm';
};
