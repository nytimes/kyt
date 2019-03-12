// Base kyt config.
// Edit these properties to make changes.

module.exports = {
  reactHotLoader: true,
  debug: false,
  modifyJestConfig(kytConfig) {
    const jestConfig = Object.assign({}, kytConfig);

    jestConfig.setupFiles = ['raf/polyfill', ...jestConfig.setupFiles];
    jestConfig.setupFilesAfterEnv = [require.resolve('./jest.setup.js')];
    jestConfig.snapshotSerializers = ['enzyme-to-json/serializer'];

    return jestConfig;
  },
};
