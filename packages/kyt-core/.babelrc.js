module.exports = {
  presets: [
    [
      'babel-preset-kyt-react',
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
