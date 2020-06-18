module.exports = {
  extends: ['airbnb/base', 'plugin:prettier/recommended', 'plugin:json/recommended'],

  env: {
    browser: true,
  },

  plugins: ['json', 'prettier'],

  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },

  globals: {
    KYT: true,
  },

  rules: {
    'no-lonely-if': 2,
    'no-nested-ternary': 2,
    'max-nested-callbacks': [2, { max: 5 }],
    'constructor-super': 2,
    'no-this-before-super': 2,
    'prefer-spread': 2,
    'arrow-parens': 0,
    'no-warning-comments': [1, { terms: ['todo', 'fixme'], location: 'start' }],
    'no-param-reassign': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'import/extensions': [1, { js: 'never' }],
    'import/max-dependencies': ['error', { max: 40 }],
    'import/no-extraneous-dependencies': [0],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [{ target: './src', from: './src/server' }],
      },
    ],
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  },
};
