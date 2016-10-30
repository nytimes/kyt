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
  .option('-r, --repository [address]', 'Github repository address')
  .action(() => loadArgsAndDo(setupAction));


program.parse(process.argv);
