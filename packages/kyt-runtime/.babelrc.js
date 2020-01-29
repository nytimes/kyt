const babelPresetKytCore = require('../babel-preset-kyt-core/src/index.js');

module.exports = {
  presets: [[babelPresetKytCore, { includeRuntime: true }]],
};
