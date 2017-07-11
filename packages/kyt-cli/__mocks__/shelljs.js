const shell = jest.genMockFromModule('shelljs');

let execReturnValue = {};

shell.exec = jest.fn(() => execReturnValue);

module.exports = shell;
// eslint-disable-next-line no-underscore-dangle
module.exports.__setExecReturnValue = v => {
  execReturnValue = v;
};
