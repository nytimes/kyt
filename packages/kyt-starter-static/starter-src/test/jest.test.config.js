const path = require('path');

module.exports = {
  displayName: {
    name: 'jest',
    color: 'cyan',
  },
  moduleNameMapper: {
    '^[./a-zA-Z0-9!&$_-]+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico)$': require.resolve(
      './jest.stub.js'
    ),
  },
  setupFiles: ['raf/polyfill'],
  setupFilesAfterEnv: [require.resolve('./jest.setup.js')],
  snapshotSerializers: ['enzyme-to-json/serializer', 'pretty-lights/jest'],
  rootDir: path.resolve(__dirname, '..'),
  cacheDirectory: path.resolve(__dirname, '../.caches/jest'),
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
