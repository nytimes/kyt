const jest = require('../jest');

it('returns a jest config', () => {
  const rootDir = 'rootDir';
  const aliases = { testAlias: 'testAlias' };

  const jestConfig = jest(rootDir);

  expect(typeof jestConfig).toBe('object');
  expect(jestConfig.moduleNameMapper).toBeDefined();
  expect(jestConfig.scriptPreprocessor).toBeDefined();
  expect(jestConfig.testPathIgnorePatterns).toBeDefined();
  expect(jestConfig.testEnvironment).toBeDefined();
  expect(jestConfig.testRegex).toBeDefined();
  expect(jestConfig.collectCoverageFrom).toBeDefined();
  expect(jestConfig.rootDir).toBe(rootDir);
});
