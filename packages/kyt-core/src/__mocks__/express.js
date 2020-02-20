const use = jest.fn();
const listen = jest.fn();
const wannabeStatic = jest.fn();
const expressMock = jest.fn(() => ({
  use,
  listen,
  static: wannabeStatic,
}));

module.exports = expressMock;
module.exports.use = use;
module.exports.listen = listen;
module.exports.static = wannabeStatic;
