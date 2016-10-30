jest.mock('../../../utils/ifPortIsFreeDo');
jest.mock('kyt-utils/paths');
jest.mock('kyt-utils/logger');
jest.mock('shelljs');

const listen = jest.fn();
jest.setMock('webpack-dev-server', () => ({ listen }));

const config = {
  modifyWebpackConfig: jest.fn(c => c),
  prototypeURL: 'url',
};

describe('proto', () => {
  global.process.exit = jest.fn();
  const proto = require('../proto');

  it('starts the proto dev server', () => {
    proto(config);
    expect(config.modifyWebpackConfig).toBeCalled();
    expect(listen).toBeCalled();
  });
});
