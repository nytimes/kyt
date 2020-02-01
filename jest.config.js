module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/packages/kyt-starter-*',
    '<rootDir>/packages/kyt-core/cli/actions/test.js',
    '<rootDir>/e2e_tests',
  ],
  collectCoverageFrom: ['**/*.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/packages/*/node_modules',
    '<rootDir>/packages/kyt-starter-*',
    '<rootDir>/coverage',
  ],
};
