
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
  const babelRegister = require.resolve('babel-register');
  const babelRC = path.resolve(userRootPath, './node_modules/kyt/.babelrc');
  const tmpBabelRC = path.resolve(userRootPath, './tmp-test/.babelrc');
  const testConfigPath = path.resolve(__dirname, '../../config/webpack.temp.test.js');
  const tempTestDir = path.join(userRootPath, './tmp-test');
  const newConfigPath = path.join(tempTestDir, './webpack.config.js');
  const fakePkgJsonPath = path.join(__dirname, '../../fakePkg.json');
  const testPkgJsonPath = path.join(userRootPath, './tmp-test/package.json');
  logger.start('Running Test Command...');

  // Clean the build directory.
  if (shell.test('-d', tempTestDir)) {
    shell.rm('-rf', tempTestDir);
    logger.task('Cleaned test folder');
  }

  // Create Temp Directory and move user src files there
  shell.mkdir(tempTestDir);
  shell.cp('-r', userSrc, tempTestDir);
  // Copy babelRC into test directory
  shell.cp(babelRC, tmpBabelRC);
  shell.cp(fakePkgJsonPath, testPkgJsonPath);
  // Copy the webpack config into the temp directory
  shell.cp(testConfigPath, newConfigPath);

  // Compile Code and move it into the user's root directory
  shell.cd(tempTestDir);

  // Execute the ava cli on our build.
  // We add our node_modules tothe NODE_PATH so that ava can be resolved.
  let command = `NODE_PATH=$NODE_PATH:${npath} NODE_ENV=TEST` +
  `node ${avaCLI} --require ${babelRegister} ${userRootPath}/tmp-test/**/*.test.js`;

  if (kytConfig.debug) command += ' --verbose';

  shell.config.silent = false;
  shell.exec(command);
  shell.cd(userRootPath);
  shell.rm('-rf', tempTestDir);
};
