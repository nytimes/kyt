const path = require('path');

const jestConfig = {
  runner: 'jest-runner-eslint',
  displayName: 'lint',
  rootDir: __dirname,
  cacheDirectory: path.join(__dirname, '.caches/jest-runner-eslint'),
  testMatch: ['<rootDir>/**/*.js(on)?'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '/dist/',
    '/build/',
    '/stage-cli/',
    '/.caches/',
    '/coverage/',
  ],
  haste: {
    computeSha1: true,
    throwOnModuleCollision: false,
  },
};

if (process.env.CI) {
  jestConfig.reporters = [['jest-silent-reporter', { useDots: true }]];
}

module.exports = jestConfig;
