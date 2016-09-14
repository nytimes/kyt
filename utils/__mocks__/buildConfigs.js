const buildConfigs = jest.fn(() => ({
  clientConfig: 'clientConfig',
  serverConfig: 'serverConfig',
  clientPort: 'clientPort',
  serverPort: 'serverPort',
}));

module.exports = buildConfigs;
