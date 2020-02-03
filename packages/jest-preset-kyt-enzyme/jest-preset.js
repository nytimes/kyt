module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '^[./a-zA-Z0-9!&$_-]+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico)$': require.resolve(
      './stub.js'
    ),
  },
  setupFiles: ['raf/polyfill'],
  setupFilesAfterEnv: [require.resolve('./setup.js')],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testRegex: '\\.test.js$',
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
