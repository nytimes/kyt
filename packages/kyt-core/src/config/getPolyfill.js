const fs = require('fs');
const { serverPolyfillsPath, clientPolyfillsPath } = require('kyt-utils/paths')();

module.exports = type => {
  if (type === 'client' && fs.existsSync(clientPolyfillsPath)) return clientPolyfillsPath;
  if (type === 'server' && fs.existsSync(serverPolyfillsPath)) return serverPolyfillsPath;
  return null;
};
