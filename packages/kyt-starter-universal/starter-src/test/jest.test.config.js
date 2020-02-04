const path = require('path');
const jestPreset = require('jest-preset-kyt-enzyme');

module.exports = {
  displayName: {
    name: 'jest',
    color: 'cyan',
  },
  preset: 'jest-preset-kyt-enzyme',
  snapshotSerializers: [...jestPreset.snapshotSerializers, 'pretty-lights/jest'],
  rootDir: path.resolve(__dirname, '..'),
};
