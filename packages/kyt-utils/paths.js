const path = require('path');
const cosmiconfig = require('cosmiconfig');
const logger = require('./logger');

/**
 * A standard `CosmiconfigResult` object with an additional `notFound` property
 * @typedef {Object} ExtendedCosmiconfigResult
 * @property {*} config The parsed configuration object. `undefined` if the file is empty.
 * @property {string} filePath The path to the configuration file that was found.
 * @property {boolean} isEmpty `true` if the configuration file is empty. This property will not be present if the configuration file is not empty.
 * @property {boolean} notFound `true` if the `CosmiconfigResult` was `null`. This property will not be present if the configuration file was found.
 */

/**
 * Utility to log a warning message if a user configuration file was not found or empty
 * @param {string} moduleDisplayName User friendly version of the `moduleName` provided to `cosmiconfig`
 * @param {ExtendedCosmiconfigResult} result
 */
function warnUserConfigIfNeeded(moduleDisplayName, result) {
  const { filepath, isEmpty, notFound } = result;
  if (notFound) {
    logger.warn(`${moduleDisplayName} configuration was not found`);
  }
  if (isEmpty) {
    logger.warn(`${moduleDisplayName} configuration at ${filepath} is empty`);
  }
}

/**
 * An object containing properties with various kyt related path details
 * @typedef {Object} GetPathsResult
 * @property {string} assetsBuildPath Path to directory containing public static build artifacts. Defaults to `${projectRoot}/build/public/`.
 * @property {string} buildPath Path to directory containing all build artifacts. Defaults to `${projectRoot}/build`.
 * @property {string} clientAssetsFile Path to file containing a revision manifest for public static build artifacts. Defaults to `${projectRoot}/build/publicAssets.json`.
 * @property {string} clientBuildPath Path to directory containing browser-specific build artifacts. Defaults to `${projectRoot}/build/client`.
 * @property {string} clientPolyfillsPath Path to file containing imports of browser-specific polyfills. Defaults to `${projectRoot}/src/client/polyfills.js`.
 * @property {string} clientSrcPath Path to directory containing browser-specific webpack entry-point module. Defaults to `${projectRoot}/src/client`.
 * @property {string} loadableAssetsFile Path to file containing a `react-loadable` manifest. Defaults to `${projectRoot}/build/loadable.json`.
 * @property {string} prototypeBuildPath Path to directory containing prototype-specific build artifacts. Defaults to `${projectRoot}/build/prototype`.
 * @property {string} publicBuildPath Path to directory containing public static build artifacts. Defaults to `${projectRoot}/build/public`.
 * @property {string} publicSrcPath Path to directory containing files that will be copied to `${assetsBuildPath}` at build time. Defaults to `${projectRoot}/src/public`.
 * @property {string} serverBuildPath Path to directory containing server-specific build artifacts. Defaults to `${projectRoot}/build/server`.
 * @property {string} serverPolyfillsPath Path to file containing imports of server-specific polyfills. Defaults to `${projectRoot}/src/server/polyfills.js`.
 * @property {string} serverSrcPath Path to directory containing server-specific webpack entry-point module. Defaults to `${projectRoot}/src/server`.
 * @property {string} srcPath Path to directory containing the project's source code. Defaults to `${projectRoot}/src`.
 * @property {string} testBuildPath Path to directory containing test-specific build artifacts. Defaults to `${projectRoot}/build/test`.
 * @property {boolean} userBabelrcIsEmpty `true` if the project's Babel configuration file is empty; `falsy` otherwise
 * @property {boolean} userBabelrcNotFound `true` if the project's Babel configuration file could not be found; `falsy` otherwise
 * @property {*} userBabelrcParsed Value containing contents of the project's Babel configuration file as loaded / parsed by `cosmiconfig` if the configuration file was found and not empty; falsy otherwise.
 * @property {string|undefined} userBabelrcPath Path to file containing project's Babel configuration if the configuration was found; falsy otherwise
 * @property {boolean} userKytConfigIsEmpty `true` if the project's Kyt configuration file is empty; `falsy` otherwise
 * @property {boolean} userKytConfigNotFound `true` if the project's Kyt configuration file could not be found; `falsy` otherwise
 * @property {*} userKytConfigParsed Value containing contents of the project's Kyt configuration file as loaded / parsed by `cosmiconfig` if the configuration file was found and not empty; falsy otherwise.
 * @property {string|undefined} userKytConfigPath Path to file containing project's Kyt configuration if the configuration was found; falsy otherwise
 * @property {string} userNodeModulesPath Path to directory used for module resolution within the project. Defaults to `${projectRoot}/node_modules`.
 * @property {string} userPackageJSONPath Path to file containing project's root module description file. Defaults to `${projectRoot}/package.json`.
 * @property {boolean} userPostcssConfigIsEmpty `true` if the project's PostCSS configuration file is empty; `falsy` otherwise
 * @property {boolean} userPostcssConfigNotFound `true` if the project's PostCSS configuration file could not be found; `falsy` otherwise
 * @property {*} userPostcssConfigParsed Value containing contents of the project's PostCSS configuration file as loaded / parsed by `cosmiconfig` if the configuration file was found and not empty; falsy otherwise.
 * @property {string|undefined} userPostcssConfigPath Path to file containing project's PostCSS configuration if the configuration was found; falsy otherwise
 * @property {string} userPrototypePath Path to file containing prototype-specific webpack entry-point module. Defaults to `${projectRoot}/prototype.js`.
 * @property {string} userRootPath Path to the project's root directory. Defaults to `process.cwd()`.
 */

/**
 * Utility to locate various kyt related paths
 * @returns {GetPathsResult}
 */
function getPaths() {
  const userRootPath = path.resolve(process.cwd());
  const buildPath = path.join(userRootPath, 'build');
  const srcPath = path.join(userRootPath, 'src');
  const serverSrcPath = path.join(srcPath, 'server');
  const clientSrcPath = path.join(srcPath, 'client');
  const publicBuildPath = path.join(buildPath, 'public');

  const explorers = {
    kyt: cosmiconfig('kyt'),
    babel: cosmiconfig('babel'),
    postcss: cosmiconfig('postcss'),
  };

  const userKytCosmiconfigSearchResult = explorers.kyt.searchSync(userRootPath) || {
    notFound: true,
  };

  const {
    filepath: userKytConfigPath,
    isEmpty: userKytConfigIsEmpty,
    config: userKytConfigParsed,
    notFound: userKytConfigNotFound = false,
  } = userKytCosmiconfigSearchResult;

  const userBabelCosmiconfigSearchResult = explorers.babel.searchSync(userRootPath) || {
    notFound: true,
  };

  const {
    filepath: userBabelrcPath,
    isEmpty: userBabelrcIsEmpty,
    config: userBabelrcParsed,
    notFound: userBabelrcNotFound = false,
  } = userBabelCosmiconfigSearchResult;

  const userPostcssCosmiconfigSearchResult = explorers.postcss.searchSync(userRootPath) || {
    notFound: true,
  };

  const {
    filepath: userPostcssConfigPath,
    isEmpty: userPostcssConfigIsEmpty,
    config: userPostcssConfigParsed,
    notFound: userPostcssConfigNotFound = false,
  } = userPostcssCosmiconfigSearchResult;

  warnUserConfigIfNeeded('kyt', userKytCosmiconfigSearchResult);
  warnUserConfigIfNeeded('Babel', userBabelCosmiconfigSearchResult);
  warnUserConfigIfNeeded('PostCSS', userPostcssCosmiconfigSearchResult);

  return {
    assetsBuildPath: path.join(publicBuildPath, '/'),
    buildPath,
    clientAssetsFile: path.join(buildPath, 'publicAssets.json'),
    clientBuildPath: path.join(buildPath, 'client'),
    clientPolyfillsPath: path.join(clientSrcPath, 'polyfills.js'),
    clientSrcPath,
    loadableAssetsFile: path.join(buildPath, 'loadable.json'),
    prototypeBuildPath: path.join(buildPath, 'prototype'),
    publicBuildPath,
    publicSrcPath: path.join(srcPath, 'public'),
    serverBuildPath: path.join(buildPath, 'server'),
    serverPolyfillsPath: path.join(serverSrcPath, 'polyfills.js'),
    serverSrcPath,
    srcPath,
    testBuildPath: path.join(buildPath, 'test'),
    userBabelrcIsEmpty,
    userBabelrcNotFound,
    userBabelrcParsed,
    userBabelrcPath,
    userKytConfigIsEmpty,
    userKytConfigNotFound,
    userKytConfigParsed,
    userKytConfigPath,
    userNodeModulesPath: path.join(userRootPath, 'node_modules'),
    userPackageJSONPath: path.join(userRootPath, 'package.json'),
    userPostcssConfigIsEmpty,
    userPostcssConfigNotFound,
    userPostcssConfigParsed,
    userPostcssConfigPath,
    userPrototypePath: path.join(userRootPath, 'prototype.js'),
    userRootPath,
  };
}

module.exports = getPaths;
