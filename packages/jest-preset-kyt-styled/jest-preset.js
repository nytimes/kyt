const runner = require.resolve('./src/index.js');

module.exports = {
  runner,
  displayName: 'stylelint',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['<rootDir>/src/**/**/styled.[jt]s?(x)'],
  cacheDirectory: '<rootDir>/.caches/jest',
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
