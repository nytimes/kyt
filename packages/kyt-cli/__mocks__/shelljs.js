const shell = jest.genMockFromModule('shelljs');

let execReturnValue = {};

shell.exec = jest.fn(() => execReturnValue);

module.exports = shell;
module.exports.__setExecReturnValue = v => {
  execReturnValue = v;
};
