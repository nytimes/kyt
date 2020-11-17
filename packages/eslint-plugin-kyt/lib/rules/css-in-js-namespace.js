const message = 'import namespace for CSS-in-JS imports should be `styles`';

exports.message = message;

exports.rule = {
  meta: {
    fixable: 'code',
  },
  create: context => {
    let hasStyled;
    let inTTL;

    return {
      ImportNamespaceSpecifier(node) {
        if (node.local.name === 'styled') {
          hasStyled = true;
          context.report({
            node,
            message,
            fix(fixer) {
              return fixer.replaceTextRange(node.local.range, 'styles');
            },
          });
        }
      },
      TaggedTemplateExpression(node) {
        inTTL = true;
      },
      'TaggedTemplateExpression:exit': node => {
        inTTL = false;
      },
      MemberExpression(node) {
        if (hasStyled && !inTTL && node.object.name === 'styled') {
          context.report({
            node,
            message,
            fix(fixer) {
              return fixer.replaceTextRange(node.object.range, 'styles');
            },
          });
        }
      },
    };
  },
};
