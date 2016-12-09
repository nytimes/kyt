const jest = require('../jest');

it('jest() returns a jest config', () => {
  const rootDir = 'rootDir';
  const jestConfig = jest(rootDir);

  expect(typeof jestConfig).toBe('object');
  expect(jestConfig.moduleNameMapper).toBeDefined();
  expect(jestConfig.moduleNameMapper['^[./a-zA-Z0-9$_-]+\\.(css|scss)$']).toBe('identity-obj-proxy');
  expect(jestConfig.scriptPreprocessor).toBeDefined();
  expect(jestConfig.testPathIgnorePatterns).toBeDefined();
  expect(jestConfig.testEnvironment).toBeDefined();
  expect(jestConfig.testRegex).toBeDefined();
  expect(jestConfig.collectCoverageFrom).toBeDefined();
  expect(jestConfig.rootDir).toBe(rootDir);
});
