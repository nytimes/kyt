const babelPresetTypescript = require('@babel/preset-typescript');
const babelPresetKytReact = require('babel-preset-kyt-react');
const babelPluginReplaceTsExportAssignment = require('babel-plugin-replace-ts-export-assignment');

module.exports = function getPreset(context, opts) {
  return {
    /**
     * Note that unlike plugins, the presets are applied in an order of last to first
     * (https://babeljs.io/docs/en/presets/#preset-ordering), so please make sure
     * `@babel/preset-typescript` is the last preset in this array.
     */
    presets: [[babelPresetKytReact, opts || {}], babelPresetTypescript],
    plugins: [babelPluginReplaceTsExportAssignment],
  };
};
