const modifyBabelConfig = jest.fn(c => c);

module.exports = () => ({
  // TODO add more to this mock (this is all we need for now)
  modifyBabelConfig,
});
