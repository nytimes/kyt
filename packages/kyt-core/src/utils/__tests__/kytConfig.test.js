jest.setMock('path', {
  join: () => 'joined-path',
  resolve: () => 'resolve',
});
jest.setMock('shelljs', {
  test: () => true,
});
jest.mock('kyt-utils/logger');

describe('kytConfig', () => {
  let logger;

  beforeEach(() => {
    jest.resetModules();
    logger = require('kyt-utils/logger');
  });

  it('logs error loading invalid kyt.config.js', () => {
    global.process.exit = jest.fn();
    require('../kytConfig')();

    expect(logger.error).toHaveBeenCalled();
    expect(global.process.exit).toHaveBeenCalled();
  });

  it('correctly builds config', () => {
    jest.mock('joined-path', () => {}, { virtual: true });
    logger.info = jest.fn();
    const config = require('../kytConfig')();

    expect(logger.info).toHaveBeenCalled();
    expect(typeof config.modifyWebpackConfig).toBe('function');

    expect(Object.isFrozen(config)).toBe(true);

    config.productionPublicPath = 'frozen!';

    expect(config.productionPublicPath).not.toBe('frozen!');
  });
});
