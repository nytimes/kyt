const shell = jest.createMockFromModule('shelljs');

let execReturnValue = {};

shell.exec = jest.fn(() => execReturnValue);

module.exports = shell;
module.exports.__setExecReturnValue = v => {
  execReturnValue = v;
};
