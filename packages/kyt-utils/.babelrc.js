const babelPresetKytCore = require('babel-preset-kyt-core');

module.exports = {
  presets: [[babelPresetKytCore, { includeRuntime: true }]],
};
