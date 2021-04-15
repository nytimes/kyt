const { RuleTester } = require('eslint');
const { rule, message } = require('../lib/rules/no-immediate-return');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
  },
});

const ruleTester = new RuleTester();

ruleTester.run('no-immediate-return', rule, {
  valid: [
    {
      code: `function Foo() { const foo = ''; const bar = ''; return foo; }`,
    },
    {
      code: `const Foo = () => { const foo = ''; const bar = ''; return foo; }`,
    },
    {
      code: `class Foo { render() { const foo = ''; const bar = ''; return foo; } }`,
    },
  ],
  invalid: [
    {
      code: `function Foo() { const foo = ''; return foo; }`,
      errors: [
        {
          message,
          type: 'ReturnStatement',
        },
      ],
    },
    {
      code: `const Foo = () => { const foo = ''; return foo; }`,
      errors: [
        {
          message,
          type: 'ReturnStatement',
        },
      ],
    },
    {
      code: `class Foo { render() { const foo = ''; return foo; } }`,
      errors: [
        {
          message,
          type: 'ReturnStatement',
        },
      ],
    },
  ],
});
