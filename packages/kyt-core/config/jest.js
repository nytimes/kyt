const path = require('path');

const resolveFromUtils = file => path.resolve(__dirname, '..', 'utils', 'jest', file);

// For configuration information, see:
// https://facebook.github.io/jest/docs/api.html#configuration-options-configuration
module.exports = (rootDir, aliases = {}) => ({
  moduleNameMapper: Object.assign(
    {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          resolveFromUtils('file.stub'),
      '^[./a-zA-Z0-9!&$_-]+\\.(css|scss)$':
          'identity-obj-proxy',
      // when this is removed from the base webpack config, we can likely
      // remove the runtime and include the polyfill in the test environment
      'babel-runtime': require.resolve('babel-plugin-transform-runtime'),
    },
    aliases
  ),
  transform: { '.*': resolveFromUtils('preprocessor') },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testPathIgnorePatterns: ['<rootDir>/(build|docs|node_modules|images)/'],
  testEnvironment: 'node',
  testRegex: '\\.test.js$',
  collectCoverageFrom: ['**/*.js'],
  rootDir,
});
