/**
 * @jest-environment node
 */

/* eslint-disable global-require, max-nested-callbacks, import/no-dynamic-require */
const os = require('os');
const fs = require('fs');
const path = require('path');
// const crypto = require('crypto');
const fse = require('fs-extra');
const pkg = require('../package');

const originalWorkingDirectory = process.cwd();
// const pkgDirname = path.dirname(require.resolve('../package'));
const modulePath = require.resolve('../paths');
const fixturesSrcPath = path.resolve(__dirname, '__fixtures__');

// const tmpDirname = '.tmp';
// const tmpPath = path.join(pkgDirname, tmpDirname);
const fixturesTmpDirname = `${pkg.name}-paths-fixtures-`;
const fixturesHome = fs.mkdtempSync(path.join(os.tmpdir(), fixturesTmpDirname));

// function createRandomTmpPathSuffix() {
//   return crypto
//     .randomBytes(20)
//     .toString('hex')
//     .substr(0, 7);
// }

function cleanTmp() {
  fse.removeSync(fixturesHome);
}

function setupFixtures() {
  // const fixturesTmpDirname = `${pkg.name}-paths-fixtures-${createRandomTmpPathSuffix()}`;
  // const fixturesTmpPath = path.join(tmpPath, fixturesTmpDirname);
  // const fixturesTmpPathMode = 0o765;
  // const fixturesHome = fse.ensureDirSync(fixturesTmpPath, fixturesTmpPathMode);
  fse.copySync(fixturesSrcPath, fixturesHome);
  return {
    dirname: fixturesHome,
  };
}

function chdirToFixtureAndResetModules(fixtures, fixturePath) {
  const { dirname } = fixtures;
  const to = path.resolve(dirname, fixturePath);
  process.chdir(to);
  jest.resetModules();
}

function getSnapshotSafePaths(paths) {
  return Object.entries(paths).reduce((prev, curr) => {
    const [key, value] = curr;
    if (typeof value !== 'string') {
      return Object.assign({}, prev, { [key]: value });
    }
    return Object.assign({}, prev, {
      [key]: value.replace(`${fs.realpathSync(fixturesHome)}`, ''),
    });
  }, {});
}

function testExpectedPropertiesDefined(paths) {
  const expectedProperties = [
    'assetsBuildPath',
    'buildPath',
    'clientBuildPath',
    'clientSrcPath',
    'prototypeBuildPath',
    'publicBuildPath',
    'publicSrcPath',
    'serverBuildPath',
    'serverSrcPath',
    'srcPath',
    'testBuildPath',
    'userBabelrcIsEmpty',
    'userBabelrcNotFound',
    'userBabelrcParsed',
    'userBabelrcPath',
    'userKytConfigIsEmpty',
    'userKytConfigNotFound',
    'userKytConfigParsed',
    'userKytConfigPath',
    'userNodeModulesPath',
    'userPackageJSONPath',
    'userPostcssConfigIsEmpty',
    'userPostcssConfigNotFound',
    'userPostcssConfigParsed',
    'userPostcssConfigPath',
    'userPrototypePath',
    'userRootPath',
  ];
  expect(paths).toBeDefined();
  expect(paths).toContainKeys(expectedProperties);
}

function testValidUserKytConfigValues(paths) {
  expect(paths).toBeDefined();
  const {
    userKytConfigIsEmpty,
    userKytConfigNotFound,
    userKytConfigParsed,
    userKytConfigPath,
  } = paths;

  expect(userKytConfigIsEmpty).toBeFalsy();
  expect(userKytConfigNotFound).toBeFalsy();
  expect(userKytConfigPath).toBeTruthy();
  expect(userKytConfigParsed).toMatchObject({
    reactHotLoader: true,
    debug: false,
  });
}

function testValidUserBabelrcValues(paths) {
  expect(paths).toBeDefined();
  const { userBabelrcIsEmpty, userBabelrcNotFound, userBabelrcParsed, userBabelrcPath } = paths;
  expect(userBabelrcIsEmpty).toBeFalsy();
  expect(userBabelrcNotFound).toBeFalsy();
  expect(userBabelrcPath).toBeTruthy();
  expect(userBabelrcParsed).toMatchObject({
    presets: ['kyt-react'],
  });
}

function testValidUserPostcssConfigValues(paths) {
  expect(paths).toBeDefined();
  const {
    userPostcssConfigIsEmpty,
    userPostcssConfigNotFound,
    userPostcssConfigParsed,
    userPostcssConfigPath,
  } = paths;
  expect(userPostcssConfigIsEmpty).toBeFalsy();
  expect(userPostcssConfigNotFound).toBeFalsy();
  expect(userPostcssConfigPath).toBeTruthy();
  expect(userPostcssConfigParsed).toMatchObject({
    plugins: {
      foo: false,
    },
  });
}

let fixtures;
describe('paths', () => {
  beforeAll(() => {
    cleanTmp();
    fixtures = setupFixtures();
  });

  afterAll(() => {
    cleanTmp();
    process.chdir(originalWorkingDirectory);
  });

  describe('with project containing standard configuration files', () => {
    let paths;

    beforeAll(() => {
      chdirToFixtureAndResetModules(fixtures, 'standard');
      paths = jest.requireActual(modulePath)();
    });

    it('returns an object with expected properties', () => {
      testExpectedPropertiesDefined(paths);
      const snapshotSafePaths = getSnapshotSafePaths(paths);
      expect(snapshotSafePaths).toMatchSnapshot();
    });

    it('has valid userKytConfig* values', () => {
      testValidUserKytConfigValues(paths);
    });

    it('has valid userBabelrc* values', () => {
      testValidUserBabelrcValues(paths);
    });

    it('has valid userPostcssConfig* values', () => {
      testValidUserPostcssConfigValues(paths);
    });
  });

  describe('with projects containing non-standard configuration files', () => {
    describe('kyt', () => {
      const table = [
        ['package.json#kyt', 'non-standard/kyt/packagejson'],
        ['.kytrc', 'non-standard/kyt/rc'],
        ['.kytrc.json', 'non-standard/kyt/rcjson'],
        ['.kytrc.yaml', 'non-standard/kyt/rcyaml'],
        ['.kytrc.yml', 'non-standard/kyt/rcyml'],
        ['.kytrc.js', 'non-standard/kyt/rcjs'],
      ];
      const name = 'with %s';
      const spec = (kind, fixturePath) => {
        let paths;

        beforeAll(() => {
          chdirToFixtureAndResetModules(fixtures, fixturePath);
          paths = jest.requireActual(modulePath)();
        });

        it('returns an object with expected properties', () => {
          testExpectedPropertiesDefined(paths);
        });

        it('has valid userKytConfig* values', () => {
          testValidUserKytConfigValues(paths);
        });
      };

      describe.each(table)(name, spec);
    });

    describe('babel', () => {
      const table = [
        ['package.json#babel', 'non-standard/babel/packagejson'],
        ['.babelrc', 'non-standard/babel/rc'],
        ['.babelrc.json', 'non-standard/babel/rcjson'],
        ['.babelrc.yaml', 'non-standard/babel/rcyaml'],
        ['.babelrc.yml', 'non-standard/babel/rcyml'],
        ['.babelrc.js', 'non-standard/babel/rcjs'],
      ];
      const name = 'with %s';
      const spec = (kind, fixturePath) => {
        let paths;

        beforeAll(() => {
          chdirToFixtureAndResetModules(fixtures, fixturePath);
          paths = jest.requireActual(modulePath)();
        });

        it('returns an object with expected properties', () => {
          testExpectedPropertiesDefined(paths);
        });

        it('has valid userBabelrc* values', () => {
          testValidUserBabelrcValues(paths);
        });
      };

      describe.each(table)(name, spec);
    });

    describe('postcss', () => {
      const table = [
        ['package.json#postcss', 'non-standard/postcss/packagejson'],
        ['.postcssrc', 'non-standard/postcss/rc'],
        ['.postcssrc.json', 'non-standard/postcss/rcjson'],
        ['.postcssrc.yaml', 'non-standard/postcss/rcyaml'],
        ['.postcssrc.yml', 'non-standard/postcss/rcyml'],
        ['.postcssrc.js', 'non-standard/postcss/rcjs'],
      ];
      const name = 'with %s';
      const spec = (kind, fixturePath) => {
        let paths;

        beforeAll(() => {
          chdirToFixtureAndResetModules(fixtures, fixturePath);
          paths = jest.requireActual(modulePath)();
        });

        it('returns an object with expected properties', () => {
          testExpectedPropertiesDefined(paths);
        });

        it('has valid userPostcssConfig* values', () => {
          testValidUserPostcssConfigValues(paths);
        });
      };

      describe.each(table)(name, spec);
    });
  });
});
