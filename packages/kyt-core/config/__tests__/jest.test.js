// can't call this `jest` because that's a global in tests
const jestConfig = require('../jest');

it('jestConfig() returns a jest config', () => {
  const rootDir = 'rootDir';
  const config = jestConfig(rootDir);

  expect(typeof config).toBe('object');
  expect(config.moduleNameMapper).toBeDefined();
  expect(config.scriptPreprocessor).toBeDefined();
  expect(config.testPathIgnorePatterns).toBeDefined();
  expect(config.testEnvironment).toBeDefined();
  expect(config.testRegex).toBeDefined();
  expect(config.collectCoverageFrom).toBeDefined();
  expect(config.rootDir).toBe(rootDir);
});
