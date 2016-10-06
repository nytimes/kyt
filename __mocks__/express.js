const use = jest.fn();
const listen = jest.fn();
const statik = jest.fn();

const expressMock = jest.fn(() => ({
  use,
  listen,
  static: statik,
}));

module.exports = expressMock;
module.exports.use = use;
module.exports.listen = listen;
module.exports.static = statik;
