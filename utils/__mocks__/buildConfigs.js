const buildConfigs = jest.fn(() => ({
  clientConfig: 'clientConfig',
  serverConfig: 'serverConfig',
}));

module.exports = buildConfigs;
