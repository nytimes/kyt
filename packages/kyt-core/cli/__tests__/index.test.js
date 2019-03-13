/* eslint-disable global-require */

jest.mock('../commands', () => {});

it('bails when min node version is not met', () => {
  global.console.error = jest.fn();
  global.console.info = jest.fn();
  delete global.process.versions.node;
  global.process.versions.node = '4.0';
  global.process.exit = jest.fn();
  require('../index');

  expect(global.console.error).toBeCalled();
  expect(process.exit).toBeCalled();
});
