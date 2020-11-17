const { RuleTester } = require('eslint');
const { rule, message } = require('../lib/rules/validate-double-underscore-dirs');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
  },
});

const ruleTester = new RuleTester();

const validFilenames = [
  '',
  '/foo/__tests__/bar/index.test.js',
  '/foo/__mocks__/bar/index.test.js',
  '/foo/__fixtures__/bar/index.test.js',
  '/foo/__snapshots__/bar/index.test.js',
  '/foo/_bar_foo/bar/index.test.js',
  '/foo/bar_foo_/bar/index.test.js',
  '/foo/bar_foo/bar/index.test.js',
  '/foo/bar__foo/bar/__index__.test.js',
  '/foo/bar__foo/bar/__fizzbuzz__',
];

const invalidFilenames = [
  '/foo/__test__/bar/index.test.js',
  '/foo/__tests_/bar/index.test.js',
  '/foo/_tests__/bar/index.test.js',
  '/foo/__whatever__/bar/index.test.js',
  '/foo/_tests_/bar/index.test.js',
  '/foo/__tests___/bar/index.test.js',
  '/foo/__bar_foo__/bar/index.test.js',
];

ruleTester.run('validate-double-underscore-dirs', rule, {
  valid: validFilenames.map(filename => ({
    code: JSON.stringify(filename),
    filename,
  })),
  invalid: invalidFilenames.map(filename => ({
    code: JSON.stringify(filename),
    filename,
    errors: [
      {
        message,
        type: 'Program',
      },
    ],
  })),
});
