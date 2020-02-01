const path = require('path');

module.exports = {
  displayName: {
    name: 'stylelint',
    color: 'magenta',
  },
  preset: 'jest-preset-kyt-styled',
  rootDir: path.resolve(__dirname, '..'),
  cacheDirectory: path.resolve(__dirname, '../.caches/jest'),
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
