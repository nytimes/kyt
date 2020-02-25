const mock = jest.fn((port, todo) => {
  todo();
});

module.exports = mock;
