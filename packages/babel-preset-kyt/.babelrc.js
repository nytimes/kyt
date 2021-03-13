const babelTransformRuntime = require('@babel/plugin-transform-runtime');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [babelTransformRuntime],
};
