const run = jest.fn();
const options = {
  entry: [],
  devServer: 'devServer',
  output: {
    path: 'fakePath',
    publicPath: 'publicPath',
  },
};
const webpackCompiler = jest.fn(() => ({ run, options }));

module.exports = webpackCompiler;
module.exports.run = run; // expose run for test assertions
