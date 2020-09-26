module.exports = {
  extends: ['airbnb/base', 'plugin:prettier/recommended', 'plugin:json/recommended'],

  env: {
    browser: true,
  },

  plugins: ['json', 'prettier'],

  parser: 'babel-eslint',
  parserOptions: {
    // airbnb is 2018, which does not include optional-chaining
    ecmaVersion: 2020,
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },

  globals: {
    KYT: true,
  },

  rules: {
    'arrow-parens': 'off',
    // airbnb sets `properties: 'never'`, which confuses the linter
    camelcase: ['error', { properties: 'always', ignoreDestructuring: false }],
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
    'constructor-super': 'error',
    'import/extensions': ['warn', { js: 'never' }],
    'import/max-dependencies': ['error', { max: 40 }],
    'import/no-extraneous-dependencies': ['off'],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [{ target: './src', from: './src/server' }],
      },
    ],
    'max-nested-callbacks': ['error', { max: 5 }],
    'no-lonely-if': 'error',
    'no-nested-ternary': 'error',
    'no-param-reassign': 'off',
    'no-this-before-super': 'error',
    'no-warning-comments': ['warn', { terms: ['todo', 'fixme'], location: 'start' }],
    'prefer-spread': 'error',
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
