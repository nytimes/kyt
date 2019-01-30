const loadableBabel = require('react-loadable/babel');

module.exports = function kytRuntimeBabel({ types: t, template }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        if (source !== 'react-loadable' || source.indexOf('kyt-runtime/dynamic') === -1) return;

        const transform = loadableBabel({ types: t, template });
        transform.visitor.ImportDeclaration(path);
      },
    },
  };
};
