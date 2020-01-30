const babelJest = {
  createTransformer: jest.fn(),
};

const paths = jest.fn(() => ({
  userRootPath: '',
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

const findBabelConfig = {
  sync: jest.fn(),
};

global.process.exit = jest.fn();

jest.setMock('babel-jest', babelJest);
jest.setMock('find-babel-config', findBabelConfig);
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
    const config = {
      presets: ['my-whatever-preset'],
      plugins: ['babel-plugin-my-whatever-plugin'],
    };
    findBabelConfig.sync.mockImplementationOnce(() => ({
      config,
    }));
    // eslint-disable-next-line import/newline-after-import
    require('../preprocessor');
    expect(babelJest.createTransformer.mock.calls.length).toBe(1);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(global.process.exit).not.toHaveBeenCalled();
    expect(babelJest.createTransformer.mock.calls[0][0]).toEqual(config);
  });

  it('otherwise uses kyt default babel preset', () => {
    findBabelConfig.sync.mockImplementationOnce(() => ({ config: null }));
    // eslint-disable-next-line import/newline-after-import
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
});
