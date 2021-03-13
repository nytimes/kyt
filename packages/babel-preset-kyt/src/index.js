const babelPresetTypescript = require('@babel/preset-typescript');
const babelPresetKytReact = require('babel-preset-kyt-react');
const babelPluginReplaceTsExportAssignment = require('babel-plugin-replace-ts-export-assignment');

module.exports = function getPreset(context, opts) {
  return {
    presets: [babelPresetTypescript, [babelPresetKytReact, opts || {}]],
    plugins: [babelPluginReplaceTsExportAssignment],
  };
};
