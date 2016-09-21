jest.mock('../../logger');
jest.setMock('glob', {
  sync: () => ({ length: 1 }),
});

const stylelintMock = {
  lint: jest.fn()
    .mockReturnValueOnce(new Promise(resolve => resolve({})))
    .mockReturnValueOnce(new Promise((resolve, reject) => reject({ stack: 'mockError' }))),
};

jest.setMock('stylelint', stylelintMock);

describe('lintStyle', () => {
  global.process.exit = jest.fn();
  const lintStyle = require('../lintStyle');

  it('lints', () => {
    lintStyle();
    expect(stylelintMock.lint).toBeCalled();
  });
});
