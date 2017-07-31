const path = require('path');
const fileExtensions = require('./fileExtensions');

const resolveFromUtils = file => path.resolve(__dirname, '..', 'utils', 'jest', file);

// For configuration information, see:
// https://facebook.github.io/jest/docs/api.html#configuration-options-configuration
module.exports = (rootDir, aliases = {}) => ({
  moduleNameMapper: Object.assign(
    {
      [fileExtensions]: resolveFromUtils('file.stub'),
      '^[./a-zA-Z0-9!&$_-]+\\.(css|scss)$': 'identity-obj-proxy',
    },
    aliases
  ),
  transform: { '.*': resolveFromUtils('preprocessor') },
  testPathIgnorePatterns: ['<rootDir>/(build|docs|node_modules|images)/'],
  testEnvironment: 'node',
  testRegex: '\\.test.js$',
  collectCoverageFrom: ['**/*.js'],
  setupFiles: [resolveFromUtils('setup')],
  rootDir,
});
