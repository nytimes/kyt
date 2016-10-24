// Checks to see if yarn is installed or not
const shell = require('shelljs');

const isYarnInstalled = () => shell.exec('yarn --version').code === 0;

module.exports = () => (isYarnInstalled() ? 'yarn' : 'npm');
