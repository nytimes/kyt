module.exports = {
  presets: [
    [
      'babel-preset-kyt-core',
      {
        includeRuntime: true,
        envOptions: {
          client: {
            targets: {
              node: 'current',
            },
          },
        },
      },
    ],
  ],
};
