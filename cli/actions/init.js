const fs = require('fs');
const chalk = require('chalk');
const logger = console;
const path = require('path');
const shell = require('shelljs');
const avaConfig = require('../../config/ava.config.js');

module.exports = (program) => {
  // Comment the following if you want
  // to see the verbose command ouput.
  shell.config.silent = true;


  // Create a symbolic link from our local .babelrc
  // to the project's main directory.
  const babelrcPath = path.resolve(__dirname, '../../.babelrc');
  const linkedPath = path.join(process.cwd(), '.babelrc');


  if (shell.ln('-s', babelrcPath, linkedPath).code === 0) {
    logger.log(chalk.green('Linked .babelrc'));
  }

  // Create a symbolic link from our local .editorconfig
  // to the project's main directory.
  const editorPath = path.resolve(__dirname, '../../.editorconfig');
  const configPath = path.join(process.cwd(), '.editorconfig');
  if (shell.ln('-s', editorPath, configPath).code === 0) {
    logger.log(chalk.green('Linked .editorconfig'));
  }

  // Edit User's Package.json
  var packageJsonPath = path.resolve(__dirname, '../../../../package.json')
  console.log('PATH', packageJsonPath);
  var packageJson = require(packageJsonPath);
  // Adding Ava Configuration
  // TODO: add ava-old if there are changes
  packageJson.ava = avaConfig;
  logger.log(chalk.green('Added ava\'s config into your package.json'));
  // Adding kyt scripts
  if(packageJson.scripts == undefined) {
    packageJson.scripts = {};
  }
  const commands = ['init','start', 'test', 'lint', 'update'];
  commands.forEach((command) => {
    commandName = 'kyt:' + command;
    packageJson.scripts[commandName] = 'kyt ' + command;
  });
  packageJson.scripts['kyt:help'] = ' kyt --help';
  logger.log(chalk.green('Added kyt\'s scripts into your npm scripts'));

  // Write changes to user's package JSON
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));


  // Create a src directory with app files.
  if (shell.ls('src').code !== 0) {
    const index = path.resolve(__dirname, '../../src');
    shell.exec(`cp -rf ${index} .`);
    logger.log(chalk.green('Created src directory with application files.'));
  } else {
    // Update Individual Files if src already exists
    if(!shell.test('-f', 'src/client.js')) {
      const client = path.resolve(__dirname, '../../src/client.js');
      shell.exec(`cp ${client} src/.`);
      logger.log(chalk.blue('Created client.js file'));
    }
    if(!shell.test('-f', 'src/server.js')) {
      const server = path.resolve(__dirname, '../../src/server.js');
      shell.exec(`cp ${server} src/.`);
      logger.log(chalk.blue('Created server.js file'));
    }
    if(!shell.test('-f', 'src/proto.js')) {
      const proto = path.resolve(__dirname, '../../src/proto.js');
      shell.exec(`cp ${proto} src/.`);
      logger.log(chalk.blue('Created proto.js file'));
    }

    if(!shell.test('-f', 'src/index.html')) {
      const indexHTML = path.resolve(__dirname, '../../src/index.html');
      shell.exec(`cp ${indexHTML} src/.`);
      logger.log(chalk.blue('Created index.html file'));
    }
    // Only update TestComponent if they already have it
    // because users may delete it
    if(shell.test('-d', 'src/components/TestComponent')) {
      const testComponent = path.resolve(__dirname, '../../src/components/TestComponent');
      shell.exec(`cp  -rf ${testComponent} src/components/.`);
      logger.log(chalk.blue('Created TestComponent directory'));
    }

  }


};
