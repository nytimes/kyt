module.exports = {
  processors: ['stylelint-processor-styled-components'],
  extends: ['stylelint-config-standard', 'stylelint-config-styled-components', 'stylelint-config-prettier'],
  rules: {
    'declaration-colon-newline-after': null,
    'declaration-no-important': true,
    'function-name-case': null,
    'no-descending-specificity': null,
    'selector-list-comma-newline-after': null,
    'value-keyword-case': null,
    'value-list-comma-newline-after': null,
  },
};
