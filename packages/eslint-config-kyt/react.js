module.exports = {
  extends: ['airbnb/rules/react', 'airbnb/rules/react-a11y', 'airbnb/hooks', 'prettier/react'],

  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },

  rules: {
    'react/sort-comp': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-fragments': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/require-extension': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-access-state-in-setstate': 'off',
    'jsx-a11y/anchor-is-valid': [
      'off',
      {
        components: ['Link'],
      },
    ],
  },
};
