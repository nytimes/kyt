module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended', 'plugin:json/recommended', 'prettier/react'],

  env: {
    jest: true,
    browser: true,
  },

  plugins: ['json', 'prettier', 'react-hooks'],

  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },

  globals: {
    KYT: true,
  },

  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
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
    'react/sort-comp': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-fragments': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/require-extension': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
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
    'jsx-a11y/anchor-is-valid': [
      'off',
      {
        components: ['Link'],
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
