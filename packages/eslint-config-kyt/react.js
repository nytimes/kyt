module.exports = {
  extends: ['airbnb/rules/react', 'airbnb/rules/react-a11y', 'airbnb/hooks'],

  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },

  rules: {
    'jsx-a11y/anchor-is-valid': [
      'off',
      {
        components: ['Link'],
      },
    ],
    // prettier/react < v8.0
    'react/jsx-child-element-spacing': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-equals-spacing': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-multi-spaces': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/jsx-wrap-multilines': 'off',
    // our rules
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/jsx-fragments': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/no-access-state-in-setstate': 'off',
    'react/require-extension': 'off',
    'react/sort-comp': 'off',
  },
};
