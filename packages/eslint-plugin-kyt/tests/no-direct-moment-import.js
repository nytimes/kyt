const { RuleTester } = require('eslint');
const { rule, message } = require('../lib/rules/no-direct-moment-import');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
});

const ruleTester = new RuleTester();

ruleTester.run('no-direct-moment-import', rule, {
  valid: [
    {
      code: `import moment from '@nyt/components/lib/utils/moment';`,
    },
    {
      code: `import momentTimezone from '@nyt/components/lib/utils/moment';`,
    },
    {
      code: `import fooBarBaz from '@nyt/components/lib/utils/moment';`,
    },
    {
      code: `const moment = require('@nyt/components/lib/utils/moment');`,
    },
    {
      code: `const momentTimezone = require('@nyt/components/lib/utils/moment');`,
    },
    {
      code: `const fooBarBaz = require('@nyt/components/lib/utils/moment');`,
    },
  ],
  invalid: [
    {
      code: `import moment from 'moment';`,
      output: `import moment from '@nyt/components/lib/utils/moment';`,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import moment from 'moment-timezone';`,
      output: `import moment from '@nyt/components/lib/utils/moment';`,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import momentTimezone from 'moment-timezone';`,
      output: `import momentTimezone from '@nyt/components/lib/utils/moment';`,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import fooBarBaz from 'moment';`,
      output: `import fooBarBaz from '@nyt/components/lib/utils/moment';`,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import fooBarBaz from 'moment-timezone';`,
      output: `import fooBarBaz from '@nyt/components/lib/utils/moment';`,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import moment from 'moment-timezone';`,
      output: `import moment from '@nyt/components/lib/utils/moment';`,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `const moment = require('moment');`,
      output: `const moment = require('@nyt/components/lib/utils/moment');`,
      errors: [
        {
          message,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const moment = require('moment-timezone');`,
      output: `const moment = require('@nyt/components/lib/utils/moment');`,
      errors: [
        {
          message,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const fooBarBaz = require('moment');`,
      output: `const fooBarBaz = require('@nyt/components/lib/utils/moment');`,
      errors: [
        {
          message,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const momentTimezone = require('moment-timezone');`,
      output: `const momentTimezone = require('@nyt/components/lib/utils/moment');`,
      errors: [
        {
          message,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const fooBarBaz = require('moment-timezone');`,
      output: `const fooBarBaz = require('@nyt/components/lib/utils/moment');`,
      errors: [
        {
          message,
          type: 'CallExpression',
        },
      ],
    },
  ],
});
