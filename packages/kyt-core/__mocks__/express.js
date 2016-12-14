const use = jest.fn();
const listen = jest.fn();
const expressMock = jest.fn(() => ({
  use,
  listen,
}));


module.exports = expressMock;
module.exports.use = use;
module.exports.listen = listen;
