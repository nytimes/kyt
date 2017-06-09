const run = jest.fn();

const defaultOptions = {
  entry: {
    main: ['main.js'],
  },
  devServer: 'devServer',
  output: {
    path: 'fakePath',
    publicPath: 'publicPath',
  },
};

const multiEntryOptions = {
  entry: {
    main: ['main.js'],
    additional: ['more.js'],
  },
  devServer: 'devServer',
  output: {
    path: 'realPath',
    publicPath: 'publicPath',
  },
};

const stringLiteralEntryOptions = {
  entry: {
    main: 'main.js',
    additional: 'more.js',
  },
  devServer: 'devServer',
  output: {
    path: 'realPath',
    publicPath: 'publicPath',
  },
};

let options = defaultOptions;

const configureOptionsType = type => {
  if (type === 'multiEntry') options = multiEntryOptions;
  else if (type === 'stringEntry') options = stringLiteralEntryOptions;
  else options = defaultOptions;
};

const webpackCompiler = jest.fn(() => ({ run, options }));

module.exports = webpackCompiler;
module.exports.configureOptionsType = configureOptionsType;
module.exports.run = run; // expose run for test assertions
