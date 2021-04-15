module.exports = {
  extends: ['kyt'],

  plugins: ['kyt'],

  rules: {
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__setExecReturnValue', '__setExecuteOnFiles', '__webpack_modules__', '__esModule'],
      },
    ],
    'kyt/css-in-js-namespace': 'error',
    'kyt/default-props': 'error',
    'kyt/no-direct-moment-import': 'error',
    'kyt/no-immediate-return': 'error',
    'kyt/validate-double-underscore-dirs': 'error',
  },

  overrides: [
    {
      files: ['**/config/*.js'],
      rules: {
        'no-console': 0,
      },
    },
    {
      files: ['*.test.js'],
      rules: {
        'global-require': 0,
      },
    },
  ],
};
