const runner = require.resolve('./src/index.js');

module.exports = {
  runner,
  displayName: 'stylelint',
  moduleFileExtensions: ['js'],
  testMatch: ['<rootDir>/src/**/**/styled.js'],
  cacheDirectory: '<rootDir>/.caches/jest',
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
