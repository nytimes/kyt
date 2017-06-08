/* eslint-disable no-console */
// Merges base and user kyt config

const path = require('path');
const shell = require('shelljs');
const merge = require('lodash.merge');
const logger = require('kyt-utils/logger');
const { userRootPath, userKytConfigPath } = require('kyt-utils/paths')();
const url = require('url');

module.exports = optionalConfig => {
  let config;

  // base config options
  const baseConfig = {
    productionPublicPath: '/',
    serverURL: 'http://localhost:3000',
    clientURL: 'http://localhost:3001',
    prototypeURL: 'http://localhost:3002',
    hasServer: true,
    debug: false,
    reactHotLoader: false,
  };

  const kytConfigPath = optionalConfig
    ? path.join(userRootPath, optionalConfig)
    : userKytConfigPath;

  // Find user config
  if (shell.test('-f', kytConfigPath)) {
    try {
      logger.log('');
      logger.info(`Using kyt config at ${kytConfigPath}`);
      // eslint-disable-next-line global-require,import/no-dynamic-require
      config = require(kytConfigPath);
    } catch (error) {
      logger.error('Error loading your kyt.config.js:', error);
      process.exit();
    }
  }

  config = merge({}, baseConfig, config);

  if (typeof config.modifyWebpackConfig === 'function') {
    logger.info('What are you doing in your modifyWebpackConfig?');
    logger.info('Let us know: https://github.com/NYTimes/kyt/issues/432');
  }

  // Create default identity functions for modify functions
  ['modifyWebpackConfig', 'modifyJestConfig'].forEach(m => {
    if (typeof config[m] !== 'function') {
      config[m] = c => c;
    }
  });

  const validateURL = (name, userURL) => {
    // Check to see if the url has the
    // required protocol, hostname and port.
    if (!userURL.protocol || !userURL.hostname || !userURL.port) {
      logger.error(`❌  Error: ${name} is an invalid url - ${userURL.href}`);
    }
  };

  // Convert the URL strings into objects
  // to make them easier to work with.
  config.serverURL = url.parse(config.serverURL);
  validateURL('serverURL', config.serverURL);
  config.clientURL = url.parse(config.clientURL);
  validateURL('clientURL', config.clientURL);
  config.prototypeURL = url.parse(config.prototypeURL);
  validateURL('prototypeURL', config.prototypeURL);

  return Object.freeze(config);
};
