const path = require('path');

const resolveFromUtils = file => path.resolve(__dirname, '..', 'utils', 'jest', file);

// For configuration information, see:
// https://facebook.github.io/jest/docs/api.html#configuration-options-configuration
module.exports = (rootDir, aliases = {}) => ({
  moduleNameMapper: Object.assign(
    {
      '\\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm)$':
          resolveFromUtils('file.stub'),
      '\\.(css|scss)$':
          resolveFromUtils('style.stub'),
      // when this is removed from the base webpack config, we can likely
      // remove the runtime and include the polyfill in the test environment
      'babel-runtime': require.resolve('babel-plugin-transform-runtime'),
    },
    aliases
  ),
  scriptPreprocessor: resolveFromUtils('preprocessor'),
  testPathIgnorePatterns: ['<rootDir>/(build|docs|node_modules|images)/'],
  testEnvironment: 'node',
  testRegex: '\\.test.js$',
  collectCoverageFrom: ['**/*.js'],
  rootDir,
});
