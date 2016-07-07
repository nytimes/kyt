var program = require('commander');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var ConfigBuilder = require('./configBuilder');
const logger = console;

program
  .option('-p, --port [number]', 'Port to run starter-kit (Required)', parseInt)
  .option('-c, --config [dir-name]', 'File for starter-kit config')
  .option('--print-config', 'Debugs by printing out the full configuration')
  .parse(process.argv);

const config = ConfigBuilder(program.config || '');

if (program.printConfig) {
  logger.dir(config, {depth: 8});
} else {

  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, config.devServer);

  server.listen(program.port, 'localhost', function () {
    logger.info('webpack-dev-server http://localhost:%d/', program.port)
  });
}
