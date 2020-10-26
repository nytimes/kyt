const { RuleTester } = require('eslint');
const { rule, message } = require('../lib/rules/css-in-js-namespace');

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

ruleTester.run('css-in-js-namespace', rule, {
  valid: [
    {
      code: `import * as styles from './styled.js'`,
    },
    {
      code: `<div className={styles.fooClass} />`,
    },
    {
      code: `<div className={cx(styles.fooClass, bar, styles.bazClass)} />`,
    },
    {
      code: `
        import * as styles from './styled.js';

        export const fooClass = styled.figure\`\`;
      `,
    },
  ],
  invalid: [
    {
      code: `import * as styled from './styled.js'`,
      output: `import * as styles from './styled.js'`,
      errors: [
        {
          message,
          type: 'ImportNamespaceSpecifier',
        },
      ],
    },
    {
      code: `import * as styled from './styled.js';
      export default () => <div className={styled.fooClass} />`,
      output: `import * as styles from './styled.js';
      export default () => <div className={styles.fooClass} />`,
      errors: [
        {
          message,
          type: 'ImportNamespaceSpecifier',
        },
        {
          message,
          type: 'MemberExpression',
        },
      ],
    },
    {
      code: `import * as styled from './styled.js';
      export default () => <div className={cx(styles.fooClass, bar, styled.bazClass)} />;`,
      output: `import * as styles from './styled.js';
      export default () => <div className={cx(styles.fooClass, bar, styles.bazClass)} />;`,
      errors: [
        {
          message,
          type: 'ImportNamespaceSpecifier',
        },
        {
          message,
          type: 'MemberExpression',
        },
      ],
    },
    {
      code: `
        import * as styled from './styled.js';

        export const fooClass = styled.figure\`\`;
      `,
      output: `
        import * as styles from './styled.js';

        export const fooClass = styled.figure\`\`;
      `,
      errors: [
        {
          message,
          type: 'ImportNamespaceSpecifier',
        },
      ],
    },
  ],
});
