
// Command to initialize kyt after installation

const fs = require('fs');
const logger = require('./../logger');
const path = require('path');
const shell = require('shelljs');
const avaConfig = require('../../config/ava.config.js');

module.exports = (program) => {

  if (process.env.NODE_ENV === 'starter') process.exit();

  // Comment the following if you want
  // to see the verbose command ouput.
  shell.config.silent = true;

  logger.start('starting kyt postinstall');

  // Create a symbolic link from our local .babelrc
  // to the project's main directory.
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  const linkedPath = path.resolve(process.cwd(), '../../.babelrc');


  if (shell.ln('-s', babelrcPath, linkedPath).code === 0) {
    logger.task('Linked .babelrc');
  }

  // Create a symbolic link from our local .editorconfig
  // to the project's main directory.
  const editorPath = path.join(process.cwd(), '.editorconfig');
  const configPath = path.resolve(process.cwd(), '../../.editorconfig');

  if (shell.ln('-s', editorPath, configPath).code === 0) {
    logger.task(' Linked .editorconfig');
  }

  // Edit User's Package.json
  var packageJsonPath = path.resolve(process.cwd(), '../../package.json');
  var packageJson = require(packageJsonPath);
  // Adding Ava Configuration
  // TODO: add ava-old if there are changes
  packageJson.ava = avaConfig;
  logger.task('Added ava\'s config into your package.json');
  // Adding kyt scripts
  if(packageJson.scripts == undefined) {
    packageJson.scripts = {};
  }
  const commands = ['dev', 'build', 'run', 'test', 'lint', 'update', 'proto'];
  commands.forEach((command) => {
    var commandName = command;
    var initialCommand = packageJson.scripts[command];

    if(initialCommand && initialCommand.indexOf('kyt') === -1) {
      commandName = 'kyt:' + command;
    }
    packageJson.scripts[commandName] = 'kyt ' + command;
  });
  packageJson.scripts['kyt:help'] = ' kyt --help';
  logger.task('Added kyt\'s scripts into your npm scripts');

  // Write changes to user's package JSON
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Copy a base kyt config
  const userKytConfig = path.resolve(__dirname,'../../../../kyt.config.js');
  if (!shell.test('-f', userKytConfig)) {
    const kytConfigOG = path.resolve(process.cwd(), './config/kyt.base.config.js');
          shell.exec(`cp ${kytConfigOG} ${userKytConfig}`);
  } else {
    logger.info('kyt config already exists; will not copy default');
  }

  logger.end('completed kyt postinstall');

};
