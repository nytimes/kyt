const program = require('commander');
const setupAction = require('./actions/setup');
const listAction = require('./actions/list');

const loadArgsAndDo = action => {
  const args = program.args.filter(item => typeof item === 'object');
  const flags = program.args.filter(item => typeof item === 'string');
  action(flags, args[0]);
};

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
    'Optional: Local path for a starter-kyt. For copying local starter-kyts for testing.'
  )
  .action(() => loadArgsAndDo(setupAction));

program.command('list').description('Lists availble supported starter-kyts').action(listAction);

program.parse(process.argv);
