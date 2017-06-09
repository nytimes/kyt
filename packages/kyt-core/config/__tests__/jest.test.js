// can't call this `jest` because that's a global in tests
const jestConfig = require('../jest');

it('jestConfig() returns a jest config', () => {
  const rootDir = 'rootDir';
  const config = jestConfig(rootDir);

  expect(typeof config).toBe('object');
  expect(config.moduleNameMapper).toBeDefined();
  expect(config.transform).toBeDefined();
  expect(config.testPathIgnorePatterns).toBeDefined();
  expect(config.testEnvironment).toBeDefined();
  expect(config.testRegex).toBeDefined();
  expect(config.collectCoverageFrom).toBeDefined();
  expect(config.rootDir).toBe(rootDir);
});

it('jestConfig().moduleNameMapper matches by extension', () => {
  const rootDir = 'rootDir';
  const config = jestConfig(rootDir);

  expect(typeof config).toBe('object');
  expect(config.moduleNameMapper).toBeDefined();

  const matchers = Object.keys(config.moduleNameMapper).map(k => new RegExp(k));

  const cssPath = './styles.css';
  const globalCssPath = 'style!css!./styles.css';
  const jpgPath = './cats.jpg';
  const jpgPathWithWebpackLoader = 'my-loader!./cats.jpg';

  expect(matchers.some(matcher => cssPath.match(matcher))).toBeTruthy();
  expect(matchers.some(matcher => globalCssPath.match(matcher))).toBeTruthy();
  expect(matchers.some(matcher => jpgPath.match(matcher))).toBeTruthy();
  expect(matchers.some(matcher => jpgPathWithWebpackLoader.match(matcher))).toBeTruthy();
});
