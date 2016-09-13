jest.setMock('path', {
  join: () => 'joined-path',
  resolve: () => 'resolve',
});
jest.setMock('shelljs', {
  test: () => true,
});

describe('kytConfig', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('logs error loading invalid kyt.config.js', () => {
    global.console.error = jest.fn();
    global.process.exit = jest.fn();
    require('../kytConfig')();

    expect(global.console.error).toBeCalled();
    expect(global.process.exit).toBeCalled();
  });

  it('correctly builds config', () => {
    jest.mock('joined-path', () => {}, { virtual: true });
    global.console.info = jest.fn();
    const config = require('../kytConfig')();

    expect(global.console.info).toBeCalled();
    expect(typeof config.modifyWebpackConfig).toBe('function');
    expect(typeof config.modifyJestConfig).toBe('function');
    expect(() => {
      config.productionPublicPath = 'frozen!';
    }).toThrow();
  });
});
