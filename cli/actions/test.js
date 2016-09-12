
// Command to run tests with Jest

const clone = require('ramda').clone;
const jest = require('jest');
const shell = require('shelljs');
const jestConfigBuilder = require('../../config/jest');
const { srcPath } = require('../../utils/paths')();


module.exports = (config, program) => {
  // Comment the following to see verbose shell ouput.
  shell.config.silent = false;

  // Grab args to pass along (e.g. kyt test -- --watch)
  const args = program.args.filter(a => typeof a === 'string');

  // set BABEL_ENV to test if undefined
  process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';

  let jestConfig = jestConfigBuilder(srcPath);
  jestConfig = config.modifyJestConfig(clone(jestConfig), { environment: 'test' });

  // TODO Remove --no-cache
  jest.run(['--config', JSON.stringify(jestConfig), '--no-cache', ...args]);
};
