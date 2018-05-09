// Checks to see if yarn is installed or not
const shell = require('shelljs');

const isYarnInstalled = () => shell.exec('[ -x "$(command -v yarn)" ]').code === 0;

module.exports = () => (isYarnInstalled() ? 'yarn' : 'npm');
