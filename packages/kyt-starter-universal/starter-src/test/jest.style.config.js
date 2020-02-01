const path = require('path');

module.exports = {
  preset: 'jest-preset-kyt-styled',
  testMatch: [path.resolve(__dirname, '../src/**/*.test.js')],
};
