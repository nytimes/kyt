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
// eslint-disable-next-line no-underscore-dangle
module.exports.__setExecuteOnFiles = newVals => {
  customExecuteOnFiles = Object.assign({}, customExecuteOnFiles, newVals);
};
