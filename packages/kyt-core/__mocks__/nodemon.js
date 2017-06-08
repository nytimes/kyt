const on = jest.fn(() => ({ on }));
const once = jest.fn(() => ({ on }));
const nodemonMock = jest.fn(() => ({
  once,
  on,
}));

module.exports = nodemonMock;
module.exports.once = once;
module.exports.on = on;
