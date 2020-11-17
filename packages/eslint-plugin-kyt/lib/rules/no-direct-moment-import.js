const message =
  'Do not import `moment` or `moment-timezone` directly. Use: `@nyt/components/lib/utils/moment`. This util exists to ensure that all uses of `moment()` are correctly timezone-aware.';

exports.message = message;

const packages = ['moment', 'moment-timezone'];
const mainPackage = '@nyt/components/lib/utils/moment';

const getReplacement = source => {
  let replacement;
  if (packages.indexOf(source.value) > -1) {
    replacement = mainPackage;
  }
  return replacement;
};

exports.rule = {
  meta: {
    fixable: 'code'
  },
  create: context => {
    const reportTarget = (node, target, replacement) => {
      const [start, end] = target.range;

      context.report({
        node,
        message,
        fix(fixer) {
          return [fixer.replaceTextRange([start + 1, end - 1], replacement)];
        },
      });
    };

    return {
      CallExpression(node) {
        if (node.callee.name !== 'require') {
          return;
        }

        const target = node.arguments[0];
        const replacement = getReplacement(target);
        if (replacement) {
          reportTarget(node, target, replacement);
        }
      },
      ImportDeclaration(node) {
        const target = node.source;
        const replacement = getReplacement(target);
        if (replacement) {
          reportTarget(node, target, replacement);
        }
      },
    };
  },
};
