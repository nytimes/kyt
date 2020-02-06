const path = require('path');

module.exports = {
  displayName: {
    name: 'stylelint',
    color: 'magenta',
  },
  preset: 'jest-preset-kyt-styled',
  rootDir: path.resolve(__dirname, '..'),
};
