const message = 'Spreading React props deopts Babel transforms.';

module.exports = function noPropsSpread(context) {
  return {
    JSXSpreadAttribute(node) {
      context.report({ node, message });
    },
  };
};
