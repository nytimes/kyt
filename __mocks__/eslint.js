let customExecuteOnFiles = {
  warningCount: 0,
  errorCount: 0,
  results: 'results',
};
const executeOnFiles = jest.fn(() => customExecuteOnFiles);
const getFormatter = jest.fn(() => () => 'formatter');

const CLIEngine = () => ({
  executeOnFiles,
  getFormatter,
});

const eslintMock = { CLIEngine };

module.exports = eslintMock;
module.exports.__setExecuteOnFiles = (newVals) => { // eslint-disable-line no-underscore-dangle
  customExecuteOnFiles = Object.assign({}, customExecuteOnFiles, newVals);
};
