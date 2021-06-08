const jestConfig = {
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '^[./a-zA-Z0-9!&$_-]+\\.(css|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico|md)$':
      require.resolve('./stub'),
  },
  setupFiles: ['raf/polyfill'],
  setupFilesAfterEnv: [require.resolve('./setup')],
  // if projects spread this value, the import can be lost if it is not absolute
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')],
  testMatch: ['**/*.test.js'],
  testEnvironment: require.resolve('jest-environment-jsdom'),
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

if (process.env.CI) {
  jestConfig.coverageReporters = ['lcov', 'text-summary'];
  jestConfig.reporters = [[require.resolve('jest-silent-reporter'), { useDots: true }]];
}

module.exports = jestConfig;
