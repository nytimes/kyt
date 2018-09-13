const fs = require('fs');
const { serverPolyfillsPath, clientPolyfillsPath } = require('kyt-utils/paths')();

const defaultPolyfill = 'babel-polyfill';

module.exports = type => {
  if (type === 'client' && fs.existsSync(clientPolyfillsPath)) return clientPolyfillsPath;
  if (type === 'server' && fs.existsSync(serverPolyfillsPath)) return serverPolyfillsPath;
  return defaultPolyfill;
};
