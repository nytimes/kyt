const { RuleTester } = require('eslint');
const { rule, message } = require('../lib/rules/default-props');

RuleTester.setDefaultConfig({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
});

const ruleTester = new RuleTester();

const classNameMessage = message('className', undefined);
const childrenMessage = message('children', null);

ruleTester.run('default-props', rule, {
  valid: [
    {
      code: `const a = {}; a.defaultProps = { className: undefined };`,
    },
    {
      code: `const a = {}; a.defaultProps = { className: 'foo' };`,
    },
    {
      code: `const a = {}; a.defaultProps = { className: 'a' };`,
    },
    {
      code: `const a = {}; const b = 'className'; a.defaultProps = { className: b };`,
    },
    {
      code: `class Foo { static defaultProps = { className: 'a' }; }`,
    },
    {
      code: `const a = {}; a.defaultProps = { children: <div /> };`,
    },
    {
      code: `const a = {}; a.defaultProps = { children: null };`,
    },
    {
      code: `class Foo { static defaultProps = { children: <div /> }; }`,
    },
    {
      code: `class Foo { static defaultProps = { children: null }; }`,
    },
  ],
  invalid: [
    {
      code: `const a = {}; a.defaultProps = { className: '' };`,
      output: `const a = {}; a.defaultProps = { className: undefined };`,
      errors: [
        {
          message: classNameMessage,
          type: 'Literal',
        },
      ],
    },
    {
      code: `const a = {}; a.defaultProps = { className: null };`,
      output: `const a = {}; a.defaultProps = { className: undefined };`,
      errors: [
        {
          message: classNameMessage,
          type: 'Literal',
        },
      ],
    },
    {
      code: `class Foo { static defaultProps = { className: '' }; }`,
      output: `class Foo { static defaultProps = { className: undefined }; }`,
      errors: [
        {
          message: classNameMessage,
          type: 'Literal',
        },
      ],
    },
    {
      code: `class Foo { static defaultProps = { className: null }; }`,
      output: `class Foo { static defaultProps = { className: undefined }; }`,
      errors: [
        {
          message: classNameMessage,
          type: 'Literal',
        },
      ],
    },
    {
      code: `const a = {}; a.defaultProps = { children: '' };`,
      output: `const a = {}; a.defaultProps = { children: null };`,
      errors: [
        {
          message: childrenMessage,
          type: 'Literal',
        },
      ],
    },
    {
      code: `const a = {}; a.defaultProps = { children: false };`,
      output: `const a = {}; a.defaultProps = { children: null };`,
      errors: [
        {
          message: childrenMessage,
          type: 'Literal',
        },
      ],
    },
    {
      code: `class Foo { static defaultProps = { children: '' }; }`,
      output: `class Foo { static defaultProps = { children: null }; }`,
      errors: [
        {
          message: childrenMessage,
          type: 'Literal',
        },
      ],
    },
    {
      code: `class Foo { static defaultProps = { children: false }; }`,
      output: `class Foo { static defaultProps = { children: null }; }`,
      errors: [
        {
          message: childrenMessage,
          type: 'Literal',
        },
      ],
    },
  ],
});
