/* eslint-disable global-require */

jest.mock('../commands', () => {});

it('bails when min node version is not met', () => {
  global.process.exit = jest.fn();
  global.console.error = jest.fn();
  global.console.info = jest.fn();
  global.process.versions = { node: '2.0' };
  require('../index');

  expect(global.console.error).toBeCalled();
  expect(process.exit).toBeCalled();
});
