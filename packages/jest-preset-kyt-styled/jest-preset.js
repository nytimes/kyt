const runner = require.resolve('./src/index.js');

module.exports = {
  runner,
  displayName: 'stylelint',
  moduleFileExtensions: ['js'],
  testMatch: ['<rootDir>/src/**/**/styled.js'],
};
