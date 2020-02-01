const path = require('path');

module.exports = {
  projects: [
    require.resolve('./test/jest.test.config.js'),
    require.resolve('./test/jest.style.config.js'),
  ],
  cacheDirectory: path.resolve(__dirname, '.caches/jest'),
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
