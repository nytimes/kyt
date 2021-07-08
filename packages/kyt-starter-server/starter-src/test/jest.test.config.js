const path = require('path');

module.exports = {
  displayName: {
    name: 'jest',
    color: 'cyan',
  },
  preset: 'jest-preset-kyt-rtl',
  snapshotSerializers: ['pretty-lights/jest'],
  rootDir: path.resolve(__dirname, '..'),
};
