const program = require('commander');
const setupAction = require('./actions/setup');

const loadArgsAndDo = (action) => {
  const args = program.args.filter(item => typeof item === 'object');
  const flags = program.args.filter(item => typeof item === 'string');
  action(flags, args[0]);
};


program
  .command('setup')
  .description('Generate a project from a github url to get started.')
  .option('-d, --directory <path>', 'Optional: Directory for your project. Defaults to your current working directory.')
  .option('-r, --repository [address]', 'Optional: Github repository address')
  .action(() => loadArgsAndDo(setupAction));


program.parse(process.argv);
