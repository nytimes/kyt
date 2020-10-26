const message = (prop, newValue) =>
  `Set the default value of \`${prop}\` to \`${newValue}\` to decrease the size of generated snapshots.`;

exports.message = message;

const reportProp = (context, prop) => {
  const newValue = prop.key.name === 'children' ? 'null' : 'undefined';
  context.report({
    node: prop.value,
    message: message(prop.key.name, newValue),
    fix(fixer) {
      return fixer.replaceTextRange(prop.value.range, newValue);
    },
  });
};

const checkProps = (context, node) => {
  if (node.properties.length === 0) {
    return;
  }

  node.properties.forEach(prop => {
    if (!(prop.key && prop.value)) {
      return;
    }

    if (prop.key.name === 'children') {
      if (prop.value.type === 'Literal' && !prop.value.value && prop.value.value !== null) {
        reportProp(context, prop);
      }
    } else if (prop.key.name === 'className') {
      if (prop.value.type === 'Literal' && !prop.value.value && prop.value.value !== undefined) {
        reportProp(context, prop);
      }
    }
  });
};

exports.rule = {
  meta: {
    fixable: 'code',
  },
  create: context => {
    return {
      ClassProperty(node) {
        if (
          node.static === true &&
          node.key &&
          node.key.name === 'defaultProps' &&
          node.value &&
          node.value.properties
        ) {
          checkProps(context, node.value);
        }
      },
      AssignmentExpression(node) {
        if (
          node.left &&
          node.left.property &&
          node.left.property.name === 'defaultProps' &&
          node.right &&
          node.right.properties
        ) {
          checkProps(context, node.right);
        }
      },
    };
  },
};
