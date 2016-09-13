const run = jest.fn();
const webpackCompiler = jest.fn(() => ({ run }));

module.exports = webpackCompiler;
module.exports.run = run;
