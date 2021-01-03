import shell from 'shelljs';
import generatePaths from '../paths';

jest.unmock('shelljs');

const requiredKeys = [
  'userRootPath',
  'srcPath',
  'buildPath',
  'publicBuildPath',
  'publicSrcPath',
  'serverSrcPath',
  'clientSrcPath',
  'clientBuildPath',
  'serverBuildPath',
  'testBuildPath',
  'assetsBuildPath',
  'userKytConfigPath',
  'userNodeModulesPath',
  'userPackageJSONPath',
];

describe('paths', () => {
  test('exports the expected properties', () => {
    const paths = generatePaths();

    requiredKeys.forEach(p => {
      expect(paths[p]).toBeDefined();
    });
  });

  test('paths change when directory changes', () => {
    const paths1 = generatePaths();
    const paths2 = generatePaths();

    expect(paths1).toEqual(paths2);

    shell.mkdir('-p', `${paths1.userRootPath}/foo`);
    shell.cd('foo');

    const paths3 = generatePaths();

    shell.cd(paths1.userRootPath);
    shell.rm('-rf', 'foo');

    expect(paths1).not.toEqual(paths3);
  });
});
