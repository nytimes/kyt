describe('paths', () => {
  const paths = require('../paths')(); // eslint-disable-line global-require

  it('exports the expected properties', () => {
    ['userRootPath',
      'srcPath',
      'buildPath',
      'publicBuildPath',
      'publicSrcPath',
      'serverSrcPath',
      'clientSrcPath',
      'clientBuildPath',
      'serverBuildPath',
      'testBuildPath',
      'prototypeBuildPath',
      'assetsBuildPath',
      'userPrototypePath',
      'userKytConfigPath',
      'userNodeModulesPath',
      'userPackageJSONPath',
    ].forEach((p) => {
      expect(paths[p]).toBeDefined();
    });
  });
});
