// Command to run tests with Jest

const child = require('child_process');
const clone = require('lodash.clonedeep');
const shell = require('shelljs');
const { srcPath } = require('kyt-utils/paths')();
const jestConfigBuilder = require('../../config/jest');
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

  process.env.KYT_ENV_TYPE = 'test';

  // Run Jest
  const testRunner = child.spawn('jest', ['--config', JSON.stringify(jestConfig), ...flags], {
    stdio: 'inherit',
  });

  testRunner.on('exit', process.exit);
};
