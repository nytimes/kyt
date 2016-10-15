const run = jest.fn();

const defaultOptions = {
  entry: {
    'main': ['main.js']
  },
  devServer: 'devServer',
  output: {
    path: 'fakePath',
    publicPath: 'publicPath',
  },
};

const multiEntryOptions = {
  entry: {
    'main': ['main.js'],
    'additional': ['more.js']
  },
  devServer: 'shitServer',
  output: {
    path: 'realPath',
    publicPath: 'killPath',
  },
};

let options = defaultOptions;

const configureOptionsType = (type) => {
  if (type === 'multiEntry') options = multiEntryOptions;
  else options = defaultOptions;
};

const webpackCompiler = jest.fn(() => ({ run, options }));

module.exports = webpackCompiler;
module.exports.__configureOptionsType = configureOptionsType;
module.exports.run = run; // expose run for test assertions
