module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '^[./a-zA-Z0-9!&$_-]+\\.(css|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico)$': require.resolve(
      './stub'
    ),
  },
  setupFiles: ['raf/polyfill'],
  setupFilesAfterEnv: [require.resolve('./setup')],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: ['**/*.test.js'],
  testEnvironment: 'jest-environment-jsdom-global',
  collectCoverageFrom: ['**/*.js'],
  coverageDirectory: '<rootDir>/coverage',
  errorOnDeprecated: true,
  cacheDirectory: '<rootDir>/.caches/jest',
  haste: {
    computeSha1: true,
    providesModuleNodeModules: [],
    throwOnModuleCollision: false,
  },
};
