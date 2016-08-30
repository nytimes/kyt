
const shell = require('shelljs');
const path = require('path');
const logger = require('../cli/logger');

module.exports = () => {
  const userRootPath = path.resolve(process.cwd());

  // Check if the user ran the command from the root
  // of their project. If not, shut the process down.
  if (!shell.test('-d', path.join(userRootPath, 'node_modules'))) {
    logger.error(`kyt works best when you execute commands
      from the root of your project where kyt is installed.`);
    process.exit();
  }

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
    assetsBuildPath: path.join(publicBuildPath, 'assets'),
    userPrototypePath: path.join(userRootPath, 'prototype.js'),
    userKytConfigPath: path.join(userRootPath, 'kyt.config.js'),
    userNodeModulesPath: path.join(userRootPath, 'node_modules'),
    userPackageJSONPath: path.join(userRootPath, 'package.json'),
  };
};
