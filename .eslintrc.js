module.exports = {
  extends: ['eslint-config-kyt'],

  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'global-require': 0,
      },
    },
  ],
};
