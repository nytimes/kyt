const program = require('commander');
const setupAction = require('./actions/setup');
const listAction = require('./actions/list');

const loadArgsAndDo = (action) => {
  const args = program.args.filter(item => typeof item === 'object');
  const flags = program.args.filter(item => typeof item === 'string');
  action(flags, args[0]);
};


program
  .command('setup')
  .description('Generate a project from a github url to get started.')
  .option('-k, --kyt-version [version]', 'For Local Dev: Version of kyt-core to install')
  .option('--repository-path [path]', 'For Local Dev: path within a repository for the main starter kyt directory. Default is the root directory of a git clone.')
  .action(() => loadArgsAndDo(setupAction));

program
  .command('list')
  .description('Lists availble supported starter-kyts')
  .action(listAction);


program.parse(process.argv);
