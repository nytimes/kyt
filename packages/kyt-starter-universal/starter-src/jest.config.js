const path = require('path');

module.exports = {
  projects: [
    require.resolve('./test/jest.test.config'),
    require.resolve('./test/jest.style.config'),
  ],
  cacheDirectory: path.resolve(__dirname, '.caches/jest'),
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
