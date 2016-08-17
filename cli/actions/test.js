
// Command to run tests with Ava

const path = require('path');
const logger = require('./../logger');
const shell = require('shelljs');
const kytConfig = require('./../../config/kyt.config');

module.exports = () => {
  // Comment the following to see verbose shell ouput.
  shell.config.silent = true;

  const userRootPath = kytConfig.userRootPath;
  const userSrc = path.join(userRootPath, 'src');
  const userBuild = path.join(userRootPath, 'build/test');
  const avaCLI = path.resolve(userRootPath, './node_modules/ava/cli.js');
  const npath = path.resolve(userRootPath, './node_modules');
  const babel = path.join(npath, '.bin/babel');
  const es2015Preset = require.resolve('babel-preset-es2015');
  const reactPreset = require.resolve('babel-preset-react');
  const presets = `${es2015Preset},${reactPreset}`;
  const babelWebpack = require.resolve('babel-plugin-webpack-loaders');
  const plugins = babelWebpack;
  const testConfigPath = path.resolve(__dirname, '../../config/webpack.temp.test.js');
  const tempTestDir = path.join(userRootPath, './tmp-test');
  const newConfigPath = path.join(tempTestDir, './webpack.config.js');

  logger.start('Running Test Command...');

  // Prep webpack Config

  // Create Temp Directory and move user src files there
  shell.mkdir(tempTestDir);
  shell.cp('-r', userSrc, tempTestDir);

  // Copy the webpack config into the temp directory
  shell.cp(testConfigPath, newConfigPath);

  // Compile Code and move it into the user's root directory
  shell.cd(tempTestDir);
  const babelCommand = `NODE_PATH=$NODE_PATH:${npath} BABEL_DISABLE_CACHE=1 ` +
  `${babel} ${tempTestDir} --ignore node_modules --presets ${presets} ` +
  `--plugins ${plugins} --out-dir ${userBuild} -s inline`;
  shell.exec(babelCommand);

  // Remove tmp directory
  shell.rm('-rf', tempTestDir);
  logger.task('Test files prepared by Babel');
  // Move back to user's root directory
  shell.cd(userRootPath);

  // Execute the ava cli on our build.
  // We add our node_modules tothe NODE_PATH so that ava can be resolved.
  let command = `NODE_PATH=$NODE_PATH:${npath} ` +
  `node ${avaCLI} ${userRootPath}/build/test/**/*.test.js`;

  if (kytConfig.debug) command += ' --verbose';

  shell.config.silent = false;
  shell.exec(command);
};
