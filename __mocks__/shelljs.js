const shell = jest.genMockFromModule('shelljs');

shell.exec = jest.fn();

module.exports = shell;
