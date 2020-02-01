const path = require('path');

module.exports = {
  projects: [
    path.resolve(__dirname, 'test/jest.test.config.js'),
    path.resolve(__dirname, 'test/jest.style.config.js'),
  ],
  cacheDirectory: path.resolve(__dirname, '.caches/jest'),
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
