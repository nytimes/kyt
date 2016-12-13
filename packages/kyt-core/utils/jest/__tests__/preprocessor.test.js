const babelJest = {
  createTransformer: jest.fn(),
};

const shell = {
  test: jest.fn(),
};

const paths = jest.fn(() => ({
  userRootPath: '',
  userBabelrcPath: '',
}));

const fs = {
  readFileSync: jest.fn(),
};

const resolve = {
  sync: jest.fn(r => r),
};

jest.setMock('babel-jest', babelJest);
jest.setMock('shelljs', shell);
jest.setMock('kyt-utils/paths', paths);
jest.setMock('fs', fs);
jest.setMock('resolve', resolve);

describe('preprocessor .babelrc use', () => {
  beforeEach(() => {
    jest.resetModules();
    babelJest.createTransformer.mockClear();
    fs.readFileSync.mockClear();
  });

  it('uses user-defined .babelrc if it exists', () => {
    shell.test.mockImplementationOnce(() => true);
    const fakeBabelrc = {
      presets: ['my-whatever-preset'],
      plugins: ['my-whatever-plugin'],
    };
    fs.readFileSync.mockImplementationOnce(() => JSON.stringify(fakeBabelrc));
    // eslint-disable-next-line global-require, import/newline-after-import
    require('../preprocessor');
    expect(babelJest.createTransformer.mock.calls.length).toBe(1);
    expect(babelJest.createTransformer.mock.calls[0][0]).toEqual({
      presets: ['babel-preset-my-whatever-preset'],
      plugins: ['babel-plugin-my-whatever-plugin'],
    });
  });

  it('otherwise uses kyt default babel preset', () => {
    shell.test.mockImplementationOnce(() => false);
    // eslint-disable-next-line global-require, import/newline-after-import
    require('../preprocessor');
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(babelJest.createTransformer.mock.calls.length).toBe(1);
    expect(babelJest.createTransformer.mock.calls[0][0].presets.length).toBe(1);
    expect(babelJest.createTransformer.mock.calls[0][0].presets[0])
      .toMatch(/babel-preset-kyt-core/);
  });
});
