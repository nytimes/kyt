
const program = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const ConfigBuilder = require('./configBuilder');
const eslintConfigBuilder = require('./eslintConfigBuilder');
const CLIEngine = require('eslint').CLIEngine;
const logger = console;
const temp = require('temp');
const fs = require('fs');
const path = require('path');

program
  .option('-p, --port [number]', 'Port to run starter-kit (Required)', parseInt)
  .option('-c, --config [dir-name]', 'File for starter-kit config')
  .option('--print-config', 'Debugs by printing out the full configuration')

program
  .command('lint')
  .description(`lint .js and .jsx files in the ./src directory.
    See more options: start-magic lint --help
  `)
  .option('-f, --config-file [filemane]', `use a local eslint file to override or add rules.
    start-magic lint -f eslint.json
  `)
  .option('-d, --dir <dir-name>', `The default directory is ./src.
    If you want to lint your own, add a comma-delimited list.
      start-magic lint -d src/,test/
  `)
  .action(() => {
    // TODO: clean this long action up...
    const args = program.args[0];
    // http://eslint.org/docs/developer-guide/nodejs-api
    let eslintCLI = {
      envs: ['browser', 'mocha'],
      extensions: ['.js', '.jsx'],
      useEslintrc: false,
    };
    // Get the default dir or the dir specified by the user/-d.
    const getFiles = () => {
      return args.dir ? args.dir.split(',') : ['src/'];
    };
    const lint = () => {
      const cli = new CLIEngine(eslintCLI);
      const report = cli.executeOnFiles(getFiles());
      const formatter = cli.getFormatter();
      logger.info(formatter(report.results));
    };

    // In order to support merging a local configFile/eslint.json,
    // we need to save the result of the merge to a temp file
    // and point to that. Otherwise, we just use our config.
    if (args.configFile) {
      let config = eslintConfigBuilder(args.configFile);
      temp.open('temp-eslintrc-', (err, info) => {
        if (!err) {
          fs.write(info.fd, JSON.stringify(config));
          fs.close(info.fd, (err) => logger.info(err));
          eslintCLI.configFile = info.path;
          lint();
          temp.cleanupSync();
        }
      });
    } else {
      eslintCLI.configFile = 'node_modules/magic-starter-kit/eslint.json';
      lint();
    }
  });

program
  .command('start')
  .description('start a server with webpack')
  .action(() => {
    logger.info(program.config);
    const config = ConfigBuilder(program.config || '', program.port);

    // Optional Flag to print config for debugging
    if (program.printConfig) {
      console.dir(config, {depth: 8});
    } else {

      /*
       * Creates a webpack dev server at the specified port
      */
      const compiler = webpack(config);
      const server = new WebpackDevServer(compiler, config.devServer);

      server.listen(program.port, 'localhost', function () {
        console.log('webpack-dev-server http://localhost:%d/', program.port)
      });
    }
  });

program.parse(process.argv);
