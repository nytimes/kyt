jest.setMock('kyt-utils/paths', () => ({
  serverPolyfillsPath: 'server-path',
  clientPolyfillsPath: 'client-path',
}));

describe('getPolyfill', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return the client path if type is client and path exists', () => {
    jest.setMock('fs', { existsSync: () => true });
    const getPolyfill = require('../getPolyfill');

    expect(getPolyfill('client')).toEqual('client-path');
  });

  it('should return the default polyfill if type is client but path does not exist', () => {
    jest.setMock('fs', { existsSync: () => false });
    const getPolyfill = require('../getPolyfill');

    expect(getPolyfill('client')).toBeNull();
  });

  it('should return the server path if type is server and path exists', () => {
    jest.setMock('fs', { existsSync: () => true });
    const getPolyfill = require('../getPolyfill');

    expect(getPolyfill('server')).toEqual('server-path');
  });

  it('should return the default polyfill if type is server but path does not exist', () => {
    jest.setMock('fs', { existsSync: () => false });
    const getPolyfill = require('../getPolyfill');

    expect(getPolyfill('server')).toBeNull();
  });
});
