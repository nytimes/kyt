const message =
  'Double-underscores can only be used when naming the following dirs: __tests__, __mocks__, __fixtures__, and __snapshots__.';

exports.message = message;

exports.rule = context => {
  return {
    'Program:exit': node => {
      const filename = context.getFilename().replace(process.cwd(), '');

      if (
        filename.match(/(\/)_+(.*)_+(\/)/) &&
        !filename.match(/(\/)__(tests|mocks|fixtures|snapshots)__(\/)/)
      ) {
        context.report({
          node,
          message,
        });
      }
    },
  };
};
