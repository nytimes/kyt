/* eslint-disable global-require */

jest.mock('kyt-utils/logger');

const stylelintMock = {
  lint: jest
    .fn()
    .mockReturnValueOnce(new Promise(resolve => resolve({})))
    .mockReturnValueOnce(new Promise((resolve, reject) => reject({ stack: 'mockError' }))),
};
jest.setMock('stylelint', stylelintMock);

jest.setMock('glob', {
  sync: jest.fn().mockReturnValueOnce(['filename']).mockReturnValueOnce([]),
});

jest.mock('kyt-utils/paths');

jest.setMock('path', {
  join: jest.fn().mockReturnValue('filename2'),
});

describe('lintStyle', () => {
  global.process.exit = jest.fn();
  const lintStyle = require('../lintStyle');
  const logger = require('kyt-utils/logger');

  describe('when there is a user configuration', () => {
    it('lints with the found filename', () => {
      lintStyle();

      expect(stylelintMock.lint).toBeCalledWith({
        files: ['userRootPath/src/**/*.css', 'userRootPath/src/**/*.scss'],
        formatter: 'string',
        configFile: 'filename',
      });
      expect(logger.info).toBeCalledWith('Using Stylelint file: filename');
    });
  });

  describe('when there is no user configuration', () => {
    it('uses the base configuration', () => {
      lintStyle();

      expect(stylelintMock.lint).toBeCalled();
      expect(stylelintMock.lint).toBeCalledWith({
        files: ['userRootPath/src/**/*.css', 'userRootPath/src/**/*.scss'],
        formatter: 'string',
        configFile: 'filename2',
      });
      expect(logger.info).toBeCalledWith('Using Stylelint file: filename2');
    });
  });
});
