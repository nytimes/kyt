
// Command to run tests with Jest

const clone = require('lodash.clonedeep');
const jest = require('jest');
const shell = require('shelljs');
const jestConfigBuilder = require('../../config/jest');
const { srcPath } = require('kyt-utils/paths')();
const buildConfigs = require('../../utils/buildConfigs');

const handleCollectCoverageFromPatternFlag = (flags) => {
  // Check for custom `--collectCoverageFromPattern` flag (with a pattern or test path arg, too)
  const collectCoverageFromPatternFlagIndex =
    flags.findIndex(flag => flag.indexOf('--collectCoverageFromPattern') >= 0)
  ;

  const pathOrPatternIndex =
    flags.findIndex(flag => flag.indexOf('-') !== 0 && flag.indexOf('--') !== 0)
  ;

  if (collectCoverageFromPatternFlagIndex >= 0 && pathOrPatternIndex >= 0) {
    // Remove proprietary flag `--collectCoverageFromPattern` and add:
    // - The `--coverage` flag
    // - The `--collectCoverageFrom` flag along with the path or pattern arg
    flags = [
      ...flags.filter((flag, index) => (
        index !== collectCoverageFromPatternFlagIndex
      )),
      '--coverage',
      `--collectCoverageFrom=${flags[pathOrPatternIndex]}`
    ];
  }

  return flags;
};

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

  // Check for custom `--collectCoverageFromPattern` flag (and possibly modify `flags`)
  flags = handleCollectCoverageFromPatternFlag(flags);

  // Run Jest
  jest.run(['--config', JSON.stringify(jestConfig), ...flags]);
};
