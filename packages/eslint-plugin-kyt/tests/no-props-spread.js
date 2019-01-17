const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-props-spread');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const ruleTester = new RuleTester();

ruleTester.run('no-props-spread', rule, {
  valid: [
    {
      code: '<div id="foo"></div>',
    },
  ],
  invalid: [
    {
      code: '<div {...{ id: "foo" }}></div>',
      errors: [
        {
          message: 'Spreading React props deopts Babel transforms.',
          type: 'JSXSpreadAttribute',
        },
      ],
    },
  ],
});
