/* eslint-disable global-require */

jest.setMock('kyt-utils/paths', () => ({ userPostcssConfigPath: 'testfile' }));
jest.mock('testfile', () => ({ plugins: ['yeah'] }), { virtual: true });
jest.setMock('../../config/postcss.config', { plugins: ['no'] });

describe('getPostcssLoader', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should use the default postcss.config.js', () => {
    jest.setMock('shelljs', { test: () => ({ code: 2 }) });
    const loader = require('../getPostcssLoader.js');
    expect(loader.options.plugins[0]).toBe('no');
  });

  it("should use the user's postcss.config.js if it exists", () => {
    jest.setMock('shelljs', { test: () => ({ code: 0 }) });
    const loader = require('../getPostcssLoader.js');
    expect(loader.options.plugins[0]).toBe('yeah');
  });
});
