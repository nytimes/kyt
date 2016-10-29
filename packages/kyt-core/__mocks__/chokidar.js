const on = jest.fn(() => ({ on }));
const watch = jest.fn(() => ({
  on,
}));
const chokidarMock = jest.fn(() => ({
  watch,
}));

module.exports = chokidarMock;
module.exports.watch = watch;
module.exports.on = on;
