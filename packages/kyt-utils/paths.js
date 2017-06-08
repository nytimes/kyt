const path = require('path');

module.exports = () => {
  const userRootPath = path.resolve(process.cwd());
  const buildPath = path.join(userRootPath, 'build');
  const srcPath = path.join(userRootPath, 'src');
  const publicBuildPath = path.join(buildPath, 'public');

  return {
    userRootPath,
    srcPath,
    buildPath,
    publicBuildPath,
    publicSrcPath: path.join(srcPath, 'public'),
    serverSrcPath: path.join(srcPath, 'server'),
    clientSrcPath: path.join(srcPath, 'client'),
    clientBuildPath: path.join(buildPath, 'client'),
    serverBuildPath: path.join(buildPath, 'server'),
    testBuildPath: path.join(buildPath, 'test'),
    prototypeBuildPath: path.join(buildPath, 'prototype'),
    assetsBuildPath: path.join(publicBuildPath, '/'),
    userPrototypePath: path.join(userRootPath, 'prototype.js'),
    userKytConfigPath: path.join(userRootPath, 'kyt.config.js'),
    userNodeModulesPath: path.join(userRootPath, 'node_modules'),
    userPackageJSONPath: path.join(userRootPath, 'package.json'),
    userBabelrcPath: path.join(userRootPath, '.babelrc'),
    userPostcssConfigPath: path.join(userRootPath, 'postcss.config.js'),
  };
};
