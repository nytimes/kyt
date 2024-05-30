const path = require('path');

module.exports = {
  displayName: {
    name: 'jest',
    color: 'cyan',
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  preset: 'jest-preset-kyt-rtl',
  snapshotSerializers: ['pretty-lights/jest'],
  rootDir: path.resolve(__dirname, '..'),
};
