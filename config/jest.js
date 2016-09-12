const path = require('path');

const resolveFromUtils = file => path.resolve(__dirname, '..', 'utils', 'jest', file);

module.exports = rootDir => ({
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+\\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm)$':
      resolveFromUtils('file.stub'),
    '^[./a-zA-Z0-9$_-]+\\.(css|scss)$':
      resolveFromUtils('style.stub'),
  },
  scriptPreprocessor: resolveFromUtils('preprocessor'),
  testPathIgnorePatterns: ['<rootDir>/(build|docs|node_modules|images)/'],
  testEnvironment: 'node',
  testRegex: '\\.test.js$',
  collectCoverageFrom: ['**/*.js'],
  rootDir,
});
