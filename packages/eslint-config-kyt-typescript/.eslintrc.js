const kytBase = require('eslint-config-kyt/base');
const airbnbTypescriptShared = require('eslint-config-airbnb-typescript/lib/shared');
const prettierTypescriptEslint = require('eslint-config-prettier/@typescript-eslint');

module.exports = {
  extends: ['kyt'],

  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',

  rules: {
    /**
     * Replace certain JS-only rules enabled by `eslint-config-airbnb` with their equivalents from
     * `@typescript-eslint/eslint-plugin`.
     *
     * @see https://github.com/iamturns/eslint-config-airbnb-typescript/blob/v12.0.0/lib/shared.js#L27
     */
    ...airbnbTypescriptShared.rules,
    // Ensure that TypeScript, Prettier, and `eslint-plugin-prettier` all play nice
    ...prettierTypescriptEslint.rules,
    // Disallow explicit `any` types
    '@typescript-eslint/no-explicit-any': 'error',
    /**
     * Disable some `@typescript-eslint/eslint-plugin` rules that `eslint-config-airbnb-typescript`
     * enables. These require parserServices to be generated (by setting `parserOptions.project` to
     * the path to a tsconfig.json file), which has a high performance cost in big projects and
     * requires additional end user configuration.
     */
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    // Enable Prettier to format JSDoc, which is particularly useful for type-checked JavaScript
    'prettier/prettier': [
      'error',
      {
        ...kytBase.rules['prettier/prettier'],
        jsdocParser: true,
      },
    ],
  },

  settings: airbnbTypescriptShared.settings,

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      // Only use @typescript-eslint/parser on TypeScript files
      // parser: '@typescript-eslint/parser',
      // parserOptions: { sourceType: 'module' },
      // plugins: ['@typescript-eslint'],
      rules: {
        ...airbnbTypescriptShared.overrides[0].rules,
        'react/jsx-filename-extension': 'off',
        // $TODO: fix these
        'react/no-multi-comp': 'off',
        // Prefer TypeScript types to PropTypes
        'react/prop-types': 'off',
      },
    },
  ],
};
