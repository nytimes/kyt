const message = 'Do not declare a variable and then immediately return it. Just return it.';

exports.message = message;

exports.rule = {
  create: context => {
    let inExpression;

    const checkForImmediateReturn = node => {
      if (inExpression || !node.body.body) {
        return;
      }

      const len = node.body.body.length;
      for (let i = 0; i < len; i += 1) {
        const n = node.body.body[i];
        const next = node.body.body[i + 1];
        if (next && n.type === 'VariableDeclaration' && n.declarations.length === 1) {
          const name = n.declarations[0].id.name;
          if (next.type === 'ReturnStatement' && name === next.argument.name) {
            context.report({
              node: next,
              message,
            });
          }
        }
      }
    };

    return {
      ExpressionStatement() {
        inExpression = true;
      },
      'ExpressionStatement:exit': () => {
        inExpression = false;
      },
      FunctionDeclaration: checkForImmediateReturn,
      ArrowFunctionExpression: checkForImmediateReturn,
      FunctionExpression: checkForImmediateReturn,
    };
  },
};
