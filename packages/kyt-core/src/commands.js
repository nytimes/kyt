const program = require('commander');
const shell = require('shelljs');
const logger = require('kyt-utils/logger');
const devAction = require('./actions/dev');
const buildAction = require('./actions/build');
const setupAction = require('./actions/setup');
const listAction = require('./actions/list');
const kytConfigFn = require('./utils/kytConfig');

// Comment the following to see verbose shell ouput.
shell.config.silent = false;

// Kill the process if the user did not run
// the command from the root of their project.
// if (!shell.test('-f', userPackageJSONPath)) {
//   logger.error(`kyt works best when you execute commands
//     from the root of your project where kyt is installed.`);
//   process.exit(1);
// }

process.on('SIGINT', () => {
  logger.warn('kyt interrupted ☝️');
  process.exit(0);
});

const loadConfigAndDo = (action, optionalConfig) => {
  const args = program.args.filter(item => typeof item === 'object');
  const flags = program.args.filter(item => typeof item === 'string');
  const config = kytConfigFn(optionalConfig);
  action(config, flags, args[0]);
};

const loadArgsAndDo = action => {
  const args = program.args.filter(item => typeof item === 'object');
  const flags = program.args.filter(item => typeof item === 'string');
  action(flags, args[0]);
};

program
  .command('dev')
  .option('-C, --config <path>', 'config path')
  .description('Start server for development')
  .action(() => {
    const args = program.args.filter(item => typeof item === 'object');
    const config = args.length && args[0].config ? args[0].config : null;
    loadConfigAndDo(devAction, config);
  });

program
  .command('build')
  .option('-C, --config <path>', 'config path')
  .description('Create a production build')
  .action(() => {
    const args = program.args.filter(item => typeof item === 'object');
    const config = args.length && args[0].config ? args[0].config : null;
    loadConfigAndDo(buildAction, config);
  });

program
  .command('setup')
  .description('Generate a project from a github url to get started.')
  .option(
    '-d, --directory <path>',
    'Optional: Creates the given directory name and installs there. Defaults to your current working directory.'
  )
  .option('-r, --repository [address]', 'Optional: Github repository address')
  .option('-k, --kyt-version [version]', 'Optional: Version of kyt-core to install')
  .option(
    '-p, --package-manager <npm|yarn>',
    'Optional: Specify which package manager to use (npm or yarn). Defaults to yarn if it is installed globally.'
  )
  .option(
    '--local-path [path]',
    'Optional: Local path for a `starter-kyt`. For copying local `starter-kyt`s for testing.'
  )
  .action(() => loadArgsAndDo(setupAction));

program.command('list').description('Lists availble supported `starter-kyt`s').action(listAction);

program
  .command('proto')
  .description('deprecated')
  .action(() => {
    logger.error('`proto` is no longer supported.');
  });

program
  .command('start')
  .description('deprecated')
  .action(() => {
    logger.error('kyt start is deprecated. \n Run the server with: node build/server/main.js');
  });

program.parse(process.argv);
