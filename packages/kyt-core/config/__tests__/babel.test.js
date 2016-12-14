const pkgJson = require('../../package.json');

const thisResolved = require.resolve(__filename);
const BABEL_PREFIX = 'babel-plugin-';

const getBabelDep = () => {
  let dep;
  Object.keys(pkgJson.dependencies).some((key) => {
    if (key.indexOf(BABEL_PREFIX) === 0) {
      dep = key;
      return true;
    }
    return false;
  });
  return dep;
};

const babelDep = getBabelDep();
const babelDepResolved = require.resolve(babelDep);
const babelDepNoPrefix = babelDep.replace(BABEL_PREFIX, '');

const presets = [[__filename]];
const plugins = [__filename, babelDep, babelDepNoPrefix];

const presetsResolved = [[thisResolved]];
const pluginsResolved = [thisResolved, babelDepResolved, babelDepResolved];

const stubBabelrc = {
  stub: true,
  env: {
    development: {
      plugins,
      presets,
    },
  },
};

jest.setMock('fs', {
  readFileSync: () => JSON.stringify(stubBabelrc),
});
jest.setMock('path', {
  resolve: a => a,
});

const babel = require('../babel');

describe('babel', () => {
  it('sets flags', () => {
    const babelrc = babel();
    expect(babelrc.babelrc).toBe(false);
    expect(babelrc.cacheDirectory).toBe(false);
  });

  it('adds RHL when given the option', () => {
    const babelrc = babel({ reactHotLoader: true });
    const devPlugins = babelrc.env.development.plugins;
    expect(devPlugins[devPlugins.length - 1]).toMatch(/react-hot-loader\/babel\.js$/);
  });

  it('resolves plugins and presets', () => {
    const babelrc = babel();
    expect(babelrc.env.development.plugins).toEqual(pluginsResolved);
    expect(babelrc.env.development.presets).toEqual(presetsResolved);
  });
});
