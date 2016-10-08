const thisResolved = require.resolve(__filename);
const stubBabelrc = {
  stub: true,
  env: {
    development: {
      plugins: [thisResolved],
      presets: [[thisResolved]],
    },
  },
};
jest.setMock('fs', {
  readFileSync: () => JSON.stringify(stubBabelrc),
});
jest.setMock('path', {
  resolve: a => a,
});

jest.mock('../../utils/kytConfig');

const babel = require('../babel');

describe('babel', () => {
  it('sets flags', () => {
    const babelrc = babel();
    expect(babelrc.babelrc).toBe(false);
    expect(babelrc.cacheDirectory).toBe(false);
  });

  it('adds RHL when given the option', () => {
    const babelrc = babel({ reactHotLoader: true });
    const plugins = babelrc.env.development.plugins;
    expect(plugins[plugins.length - 1]).toMatch(/react-hot-loader\/babel\.js$/);
  });

  it('resolves plugins and presets', () => {
    const babelrc = babel();
    expect(babelrc.env.development.plugins).toEqual([thisResolved]);
    expect(babelrc.env.development.presets).toEqual([[thisResolved]]);
  });
});
