
// Command to run tests with Ava

const path = require('path');
const logger = require('./../logger');
const shell = require('shelljs');
const kytConfig = require('./../../config/kyt.config');


module.exports = () => {
  // Comment the following to see verbose shell ouput.
  //shell.config.silent = true;

  const userRootPath = kytConfig.userRootPath;
  const userSrc = path.join(userRootPath, 'src');
  const avaCLI = path.resolve(userRootPath, './node_modules/ava/cli.js');
  const npath = path.resolve(userRootPath, './node_modules');
  const testConfigPath = path.resolve(__dirname, '../../config/webpack.temp.test.js');
  const tempTestDir = path.join(userRootPath, './kyt-test');
  const newConfigPath = path.join(tempTestDir, './webpack.config.js');
  const avaPkgJsonPath = path.join(__dirname, '../../config/ava.package.json');
  const testPkgJsonPath = path.join(tempTestDir, './package.json');
  logger.start('Running Test Command...');

  // Clean the build directory.
  if (shell.test('-d', tempTestDir)) {
    shell.rm('-rf', tempTestDir);
    logger.task('Cleaned test folder');
  }

  // Create Temp Directory and move user src files there
  shell.mkdir(tempTestDir);
  shell.cp('-r', userSrc, tempTestDir);

  // Copy ava's configuration into the root
  shell.cp(avaPkgJsonPath, testPkgJsonPath);
  // Copy the webpack config into the temp directory
  shell.cp(testConfigPath, newConfigPath);

  // Compile Code and move it into the user's root directory
  shell.cd(tempTestDir);

  // Execute the ava cli on our build.
  // We add our node_modules tothe NODE_PATH so that ava can be resolved.
  let command = `NODE_PATH=$NODE_PATH:${npath} CONFIG=${newConfigPath} BABEL_DISABLE_CACHE=1 ` +
  `node ${avaCLI} ${userRootPath}/kyt-test/**/*.test.js`;

  if (kytConfig.debug) command += ' --verbose';

  shell.config.silent = false;
  shell.exec(command);
  shell.cd(userRootPath);
  shell.rm('-rf', tempTestDir);
};
