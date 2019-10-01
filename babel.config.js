const babelPresetKytCore = require('./packages/babel-preset-kyt-core/lib/index.js');

module.exports = {
  presets: [[babelPresetKytCore, { includeRuntime: true }]],
};
