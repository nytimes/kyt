const path = require('path');

module.exports = () => {
  const userRootPath = path.resolve(process.cwd());
  const buildPath = path.join(userRootPath, 'build');
  const srcPath = path.join(userRootPath, 'src');
  const serverSrcPath = path.join(srcPath, 'server');
  const clientSrcPath = path.join(srcPath, 'client');
  const publicBuildPath = path.join(buildPath, 'public');

  return {
    userRootPath,
    srcPath,
    buildPath,
    publicBuildPath,
    clientAssetsFile: path.join(buildPath, 'publicAssets.json'),
    loadableAssetsFile: path.join(buildPath, 'loadable.json'),
    publicSrcPath: path.join(srcPath, 'public'),
    serverSrcPath,
    serverPolyfillsPath: path.join(serverSrcPath, 'polyfills.js'),
    clientSrcPath,
    clientPolyfillsPath: path.join(clientSrcPath, 'polyfills.js'),
    clientBuildPath: path.join(buildPath, 'client'),
    serverBuildPath: path.join(buildPath, 'server'),
    testBuildPath: path.join(buildPath, 'test'),
    prototypeBuildPath: path.join(buildPath, 'prototype'),
    assetsBuildPath: path.join(publicBuildPath, '/'),
    userPrototypePath: path.join(userRootPath, 'prototype.js'),
    userKytConfigPath: path.join(userRootPath, 'kyt.config.js'),
    userNodeModulesPath: path.join(userRootPath, 'node_modules'),
    userPackageJSONPath: path.join(userRootPath, 'package.json'),
    userBabelrcPath: path.join(userRootPath, '.babelrc.js'),
    userPostcssConfigPath: path.join(userRootPath, 'postcss.config.js'),
  };
};
