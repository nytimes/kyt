// Command to run tests with Jest

const clone = require('lodash.clonedeep');
const jest = require('jest');
const shell = require('shelljs');
const jestConfigBuilder = require('../../config/jest');
const { srcPath } = require('kyt-utils/paths')();
const buildConfigs = require('../../utils/buildConfigs');

module.exports = (config, flags) => {
  // Comment the following to see verbose shell ouput.
  shell.config.silent = false;

  // set BABEL_ENV to test if undefined
  process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';

  // Grab aliases from webpack config
  const aliases = buildConfigs(config).clientConfig.resolve.alias;

  // Build Jest config
  let jestConfig = jestConfigBuilder(srcPath, aliases);
  jestConfig = config.modifyJestConfig(clone(jestConfig));

  // Run Jest
  jest.run(['--config', JSON.stringify(jestConfig), ...flags]);
};
