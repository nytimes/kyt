
// Merges base and user kyt config

const path = require('path');
const shell = require('shelljs');
const mergeAll = require('ramda').mergeAll;
const url = require('url');
const { userRootPath, userKytConfigPath } = require('./paths')();


// Parses config urls into:
// protocol
// hostname
// port
const parseUrl = (config) => {
  if (config.clientURL) {
    const clientURLObj = url.parse(config.clientURL);
    if (clientURLObj.port) config.clientPort = clientURLObj.port;
    if (clientURLObj.hostname) config.clientHost = clientURLObj.hostname;
    if (clientURLObj.protocol) config.clientProtocol = clientURLObj.protocol.replace(':', '');
  } else {
    config.clientURL = 'http://localhost:3001';
  }
  if (config.serverURL) {
    const serverURLObj = url.parse(config.serverURL);
    if (serverURLObj.port) config.clientPort = serverURLObj.port;
    if (serverURLObj.hostname) config.clientHost = serverURLObj.hostname;
    if (serverURLObj.protocol) config.clientProtocol = serverURLObj.protocol.replace(':', '');
  } else {
    config.serverURL = 'http://localhost:3000';
  }
};

module.exports = (optionalConfig) => {
  if (global.config) return;

  // base config options
  const baseConfig = {
    productionPublicPath: '/assets/',
    clientPort: 3001,
    serverPort: 3000,
    clientHost:'localhost',
    serverHost: 'localhost',
    clientProtocol: 'http',
    serverProtocol: 'http',
    prototypePort: 3002,
    prototypeHost: 'localhost',
    prototypePrototcol: 'http',
    debug: false,
    reactHotLoader: false,
  };

  const userConfigPath = optionalConfig
    ? path.join(userRootPath, optionalConfig)
    : userKytConfigPath;
  let config;
  const logger = console;

  // Find user config
  if (shell.test('-f', userConfigPath)) {
    try {
      logger.info(`Using kyt config at ${userConfigPath}`);
      config = require(userConfigPath); // eslint-disable-line global-require
    } catch (error) {
      logger.error('Error loading your kyt.config.js:', error);
      process.exit();
    }
  }
  parseUrl(config);
  config = mergeAll([{}, baseConfig, config]);

  // Create default modify function
  if (typeof config.modifyWebpackConfig !== 'function') {
    config.modifyWebpackConfig = (webpackConfig) => webpackConfig;
  }

  global.config = Object.freeze(config);
};
