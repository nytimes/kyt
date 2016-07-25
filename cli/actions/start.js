
const shell = require('shelljs');

module.exports = (program) => {
  const args = program.args[0];
  const options = {
    port: args.port ? args.port : 3333,
    server: true,
    environment: process.env.NODE_ENV || 'development',
    printConfig: !!args.printConfig,
    configPath: args.config
  };

  process.env.KYT_OPTIONS = JSON.stringify(options);

  shell.exec('node_modules/.bin/babel-node src/server');
};
