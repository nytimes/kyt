it('kytConfig', () => {
  jest.setMock('path', {
    join: () => 'joined-path',
    resolve: () => 'resolve',
  });
  jest.setMock('shelljs', {
    test: () => true,
  });
  jest.mock('joined-path', () => {}, { virtual: true });

  const kytConfig = require('../kytConfig');

  const config = kytConfig();

  expect(typeof config.modifyWebpackConfig).toBe('function');
  expect(typeof config.modifyJestConfig).toBe('function');
  expect(() => {
    config.productionPublicPath = 'frozen!';
  }).toThrow();
});
