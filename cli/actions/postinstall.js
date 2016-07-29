const fs = require('fs');
const chalk = require('chalk');
 const logger = console;
const path = require('path');
const shell = require('shelljs');
const avaConfig = require('../../config/ava.config.js');

module.exports = (program) => {
  //Comment the following if you want
  //to see the verbose command ouput.
  shell.config.silent = true;


  logger.log('kyt postinstall');

  // Create a symbolic link from our local .babelrc
  // to the project's main directory.
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  const linkedPath = path.resolve(process.cwd(), '../../.babelrc');


  if (shell.ln('-s', babelrcPath, linkedPath).code === 0) {
    logger.log(chalk.green('Linked .babelrc'));
  }

  // Create a symbolic link from our local .editorconfig
  // to the project's main directory.
  const editorPath = path.join(process.cwd(), '.editorconfig');
  const configPath = path.resolve(process.cwd(), '../../.editorconfig');

  if (shell.ln('-s', editorPath, configPath).code === 0) {
    logger.log(chalk.green('Linked .editorconfig'));
  }

  // Edit User's Package.json
  var packageJsonPath = path.resolve(process.cwd(), '../../package.json');
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
  const commands = ['init','start', 'test', 'lint', 'update', 'proto'];
  commands.forEach((command) => {
    commandName = 'kyt:' + command;
    packageJson.scripts[commandName] = 'kyt ' + command;
  });
  packageJson.scripts['kyt:help'] = ' kyt --help';
  logger.log(chalk.green('Added kyt\'s scripts into your npm scripts'));

  // Write changes to user's package JSON
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));


  // Create a src directory with app files.
  console.log('CURRENT DIR', process.cwd());
  const src = path.resolve(process.cwd(), '../../src');
  console.log('SRC', src);
  if (shell.ls(src).code !== 0) {
    shell.exec(`cp -rf ./src ${src}`);
    logger.log(chalk.green('Created src directory with application files.'));
  } else {
    // Update Individual Files if src already exists
    const client = path.resolve(process.cwd(), '../../src/client.js');
    if(!shell.test('-f', client)) {
      const clientOG = path.resolve(process.cwd(), './src/client.js');
      shell.exec(`cp  ${clientOG} ${client} `);
      logger.log(chalk.blue('Created client.js file'));
    }
    const server = path.resolve(process.cwd(), '../../src/server.js');
    if(!shell.test('-f', server)) {
      const serverOG = path.resolve(process.cwd(), './src/server.js');
      shell.exec(`cp ${serverOG} ${server}`);
      logger.log(chalk.blue('Created server.js file'));
    }
    const proto = path.resolve(process.cwd(), '../../src/proto.js');
    if(!shell.test('-f', proto)) {
      const protoOG = path.resolve(process.cwd(), './src/proto.js');
      shell.exec(`cp ${protoOG} ${proto}`);
      logger.log(chalk.blue('Created proto.js file'));
    }
    const indexHTML = path.resolve(process.cwd(), '../../src/index.html');
    if(!shell.test('-f', indexHTML)) {
      const indexOG = path.resolve(process.cwd(), './src/index.html');
      shell.exec(`cp ${indexOG} ${indexHTML}`);
      logger.log(chalk.blue('Created index.html file'));
    }
    // Only update TestComponent if they already have it
    // because users may delete it
    const testComponent = path.resolve(process.cwd(), '../../src/components/TestComponent');
    if(shell.test('-d', testComponent)) {
      const testComponentOG = path.resolve(process.cwd(), './src/components/TestComponent/');
      // Remove and recopy the test component
      shell.exec(`rm -rf ${testComponent}`);
      shell.exec(`cp  -rf ${testComponentOG} ${testComponent}`);
      logger.log(chalk.blue('Created TestComponent directory'));
    }

  }


};
