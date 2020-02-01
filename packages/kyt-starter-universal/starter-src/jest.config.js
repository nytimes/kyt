const path = require('path');

const cacheDirectory = path.resolve(__dirname, '.caches/jest');

module.exports = {
  projects: ['<rootDir>/test/jest.test.config.js', '<rootDir>/test/jest.style.config.js'],
  cacheDirectory,
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
