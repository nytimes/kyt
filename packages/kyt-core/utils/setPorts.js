const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

// Checks if PORT and PORT_DEV are available and suggests alternatives if not
module.exports = async config => {
  const port = (config.serverURL && parseInt(config.serverURL.port, 10)) || 3000;
  const portDev = (config.clientURL && parseInt(config.clientURL.port, 10)) || port + 1;

  const actualPort = await choosePort(process.env.HOST, port);
  const actualPortDev = await choosePort(process.env.HOST, portDev);

  process.env.PORT = actualPort;
  process.env.PORT_DEV = actualPortDev;
};
