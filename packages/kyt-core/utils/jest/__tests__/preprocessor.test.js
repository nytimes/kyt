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
  sync: jest.fn(p => `/path/to/${p}`),
};

const logger = {
  warn: jest.fn(),
  error: jest.fn(),
};

global.process.exit = jest.fn();

jest.setMock('babel-jest', babelJest);
jest.setMock('shelljs', shell);
jest.setMock('kyt-utils/paths', paths);
jest.setMock('fs', fs);
jest.setMock('resolve', resolve);
jest.setMock('kyt-utils/logger', logger);

describe('jest preprocessor', () => {
  beforeEach(() => {
    jest.resetModules();
    babelJest.createTransformer.mockClear();
    logger.warn.mockClear();
    logger.error.mockClear();
    fs.readFileSync.mockClear();
    global.process.exit.mockClear();
  });

  it('uses user-defined .babelrc if it exists', () => {
    shell.test.mockImplementationOnce(() => true);
    const fakeBabelrc = {
      presets: ['my-whatever-preset'],
      plugins: ['babel-plugin-my-whatever-plugin'],
    };
    fs.readFileSync.mockImplementationOnce(() => JSON.stringify(fakeBabelrc));
    // eslint-disable-next-line global-require, import/newline-after-import
    require('../preprocessor');
    expect(babelJest.createTransformer.mock.calls.length).toBe(1);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(global.process.exit).not.toHaveBeenCalled();
    expect(babelJest.createTransformer.mock.calls[0][0]).toEqual({
      presets: ['/path/to/babel-preset-my-whatever-preset'],
      plugins: ['/path/to/babel-plugin-my-whatever-plugin'],
    });
  });

  it('otherwise uses kyt default babel preset', () => {
    shell.test.mockImplementationOnce(() => false);
    // eslint-disable-next-line global-require, import/newline-after-import
    require('../preprocessor');
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(babelJest.createTransformer.mock.calls.length).toBe(1);
    expect(babelJest.createTransformer.mock.calls[0][0].presets.length).toBe(1);
    expect(logger.error).not.toHaveBeenCalled();
    expect(global.process.exit).not.toHaveBeenCalled();
    expect(babelJest.createTransformer.mock.calls[0][0].presets[0]).toMatch(
      /babel-preset-kyt-core/
    );
  });

  it('errors and exits if a plugin or preset is not resolvable', () => {
    shell.test.mockImplementationOnce(() => true);
    const fakeBabelrc = {
      presets: ['my-whatever-preset'],
      plugins: ['babel-plugin-my-whatever-plugin'],
    };
    fs.readFileSync.mockImplementationOnce(() => JSON.stringify(fakeBabelrc));
    const err = new Error('fake error');
    resolve.sync.mockImplementationOnce(() => {
      throw err;
    });
    // eslint-disable-next-line global-require, import/newline-after-import
    require('../preprocessor');
    expect(logger.error).toHaveBeenCalledWith(
      'Could not resolve dependency',
      'babel-plugin-my-whatever-plugin'
    );
    expect(logger.error).toHaveBeenCalledWith('Error output', err);
    expect(logger.error).toHaveBeenCalledWith('Exiting...');
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
