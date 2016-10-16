const fakeTransformer = {};

jest.setMock('babel-jest', {
  createTransformer: jest.fn(() => fakeTransformer),
});
const babelJest = require('babel-jest');

const fakeBabelResult = {};

jest.setMock('../../../config/babel', jest.fn(() => fakeBabelResult));
const babel = require('../../../config/babel');

describe('preprocessor', () => {
  it('calls the babel utility and babel-jest\'s createTransformer', () => {
    const preprocessor = require('../preprocessor'); // eslint-disable-line global-require
    expect(preprocessor).toBe(fakeTransformer);
    expect(babel.mock.calls[0][0]).toEqual({
      type: 'test',
      environment: 'test',
    });
    expect(babelJest.createTransformer).toBeCalledWith(fakeBabelResult);
  });
});
