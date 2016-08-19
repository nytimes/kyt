
// Surface any uncaught errors
process.on('uncaughtException', (error) => {
  const log = console;
  log.error('UNHANDLED EXCEPTION', error.stack);
  process.exit();
});

const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const inquire = require('inquirer');
const simpleGit = require('simple-git')();
const logger = require('./../logger');
const kytConfig = require('../../config/kyt.config');

module.exports = (program) => {
  const args = program.args[0];
  const userRootPath = kytConfig.userRootPath;
  const userSrc = path.join(userRootPath, 'src');
  const packageJSONPath = path.join(userRootPath, 'package.json');
  const nodeModulesPath = path.join(userRootPath, 'node_modules');
  const gitignoreFile = path.join(userRootPath, '.gitignore');
  const tmpDir = path.resolve(userRootPath, '\.kyt-tmp'); // eslint-disable-line no-useless-escape
  const repoURL = args.repository || 'git@github.com:nytm/wf-kyt-starter.git';
  const removeTmpDir = () => shell.rm('-rf', tmpDir);
  let defaultMode = true;
  let oldPackageJSON;
  const bailProcess = (error) => {
    logger.error(`Failed to setup: ${repoURL}`);
    if (error) logger.log(error);
    removeTmpDir();
    process.exit();
  };

  // Comment the following to see verbose shell ouput.
  shell.config.silent = true;

  // First, clean any old cloned repositories.
  removeTmpDir();

  const afterClone = (error) => {
    if (error) {
      logger.error('There was a problem cloning the repository');
      logger.log(error);
      bailProcess();
    }

    // Add dependencies, scripts and other package to
    // the user's package.json configuration.
    const updateUserPackageJSON = () => {
      let userPackageJSON;
      // Create a package.json definition if
      // the user doesn't already have one.
      if (shell.test('-f', packageJSONPath)) {
        userPackageJSON = require(packageJSONPath); // eslint-disable-line global-require
      } else {
        userPackageJSON =
          { name: '', version: '1.0.0', description: '', main: '', author: '', license: '' };
        logger.task('Creating a new package.json. You should fill it in.');
      }

      // Clone the package.json so that we have a backup.
      oldPackageJSON = Object.assign({}, userPackageJSON);

      // Add dependencies from starter-kyts
      if (!defaultMode) {
        userPackageJSON = updatePackageJSONDependencies(userPackageJSON);
      }

      // Add scripts
      userPackageJSON = addPackageJsonScripts(userPackageJSON);
      fs.writeFileSync(packageJSONPath, JSON.stringify(userPackageJSON, null, 2));
    };

    // Adds dependencies from the starter-kyts package.json
    const updatePackageJSONDependencies = (packageJson) => {
      // eslint-disable-next-line global-require
      const tempPackageJSON = require(`${tmpDir}/package.json`);
      const tempDependencies = tempPackageJSON.dependencies || {};

      // In case the starter kyt used `kyt` as a dependency.
      if (tempDependencies.kyt) delete tempDependencies.kyt;

      packageJson.dependencies = Object.assign(
        packageJson.dependencies || {},
        tempPackageJSON.dependencies
      );
      logger.task('Added new dependencies to package.json');
      return packageJson;
    };

    // Adds kyt commands as npm scripts
    const addPackageJsonScripts = (packageJson) => {
      if (!packageJson.scripts) packageJson.scripts = {};
      const commands = ['dev', 'build', 'run', 'test', 'lint', 'proto'];
      commands.forEach((command) => {
        if (packageJson.scripts[command]) return;
        packageJson.scripts[command] = `kyt ${command}`;
      });
      packageJson.scripts['kyt:help'] = ' kyt --help';
      logger.task('Added kyt scripts into your package.json scripts');
      return packageJson;
    };


    // Cleans and reinstalls node modules.
    const installUserDependencies = () => {
      logger.info('Cleaning node modules and reinstalling. This may take a couple of minutes...');
      if (shell.exec(`rm -rf ${nodeModulesPath} && npm cache clear && npm i`).code !== 0) {
        fs.writeFileSync(packageJSONPath, JSON.stringify(oldPackageJSON, null, 2));
        logger.error('An error occurred when trying to install node modules');
        logger.task('Restored the original package.json and bailing');
        logger.info('You may need to reinstall your modules');
        bailProcess();
      }
      logger.task('Installed new modules');
    };

    // Creates a symbolic link from our local
    // .editorconfig to the user's base directory.
    const createEditorconfigLink = () => {
      const editorPath = './node_modules/kyt/.editorconfig';
      const configPath = path.join(userRootPath, '.editorconfig');

      // Backup existing editor config
      if (shell.test('-f', configPath)) {
        const mvTo = path.join(userRootPath, `editorconfig-${Date.now()}.bak`);
        shell.mv(configPath, mvTo);
        logger.info(`Backed up current editor config to ${mvTo}`);
      }

      shell.cp(editorPath, configPath);
      logger.task('Copied .editorconfig');
    };

    // Copies the starter kyt kyt.config.js
    // to the user's base directory.
    const createKytConfig = () => {
      const userKytConfig = path.join(userRootPath, 'kyt.config.js');
      const tmpConfig = path.join(tmpDir, 'kyt.config.js');
      const baseConfig = path.join(__dirname, '../../config/kyt.base.config.js');
      let newConfig = tmpConfig;

      // Use the base kyt.config
      // if one does not exist in the starter
      if (!shell.test('-f', tmpConfig)) {
        newConfig = baseConfig;
      }
      const copyConfig = () => {
        shell.cp(newConfig, userKytConfig);
        logger.task('Created new kyt.config.js');
      };
      if (shell.test('-f', userKytConfig)) {
        // Since the user already has a kyt.config,
        // we need to back it up before copying.
        const mvTo = path.join(userRootPath, `kyt.config-${Date.now()}.bak.js`);
        shell.mv('-f', userKytConfig, mvTo);
        logger.info(`Backed up current kyt.config.js to: ${mvTo}`);
        copyConfig();
      } else {
        copyConfig();
      }
    };

    // Copies the src directory from the cloned
    // repo into the user's base direcotry.
    const createSrcDirectory = () => {
      const cpSrc = () => {
        shell.cp('-r', `${tmpDir}/src`, userRootPath);
        logger.task('Created src directory');
      };
      if (shell.test('-d', userSrc)) {
        // Since the user already has a src directory,
        // we need to make a backup before copying.
        const mvTo = path.join(userRootPath, `src-${Date.now()}-bak`);
        shell.mv('-f', userSrc, mvTo);
        logger.info(`Backed up current src directory to: ${mvTo}`);
      }

      cpSrc();
    };

    // Copies gitignore file
    const createGitignore = () => {
      if (!shell.test('-f', gitignoreFile)) {
        const gitignoreLocal = path.resolve(__dirname, '../../.gitignore');
        shell.cp(gitignoreLocal, gitignoreFile);
        logger.task('Created .gitignore file');
      }
    };


    // Creates prototype file if one exists
    const createPrototypeFile = () => {
      const userProto = path.join(userRootPath, './prototype.js');
      const starterProto = `${tmpDir}/prototype.js`;
      // No need to copy file if it doesn't exist
      if (!shell.test('-f', starterProto)) return;
      // Backup user's prototype file if they already have one
      if (shell.test('-f', userProto)) {
        const prototypeBackup = path.join(userRootPath, `prototype-${Date.now()}-bak.js`);
        shell.mv(userProto, prototypeBackup);
        logger.info(`Backed up current prototype file to: ${prototypeBackup}`);
      }
      // Copy the prototype file from the starter kit into the users repo
      shell.cp(starterProto, userProto);
      logger.task('copied prototype.js file into root');
    };

    // Selects type of setup
    const setupPrompt = () => {
      // Skip starter-kyt question if they've already supplied a repo name
      if (args.repository) {
        srcPrompt(starterKytSetup);
      } else {
        let question = [
          {
            type: 'confirm',
            name: 'setupStarter',
            message: 'Would you like to setup with the default starter-kyt?',
            default: false
          }
        ];
        inquire.prompt(question).then((answer) => {
            if (answer.setupStarter) {
              srcPrompt(starterKytSetup);
            } else {
              defaultSetup();
            }
        });
      }
    };

    // setup flow for starter-kyts
    const starterKytSetup = () => {
      defaultMode = false;
      logger.start('Setting up starter-kyt');
      updateUserPackageJSON();
      installUserDependencies();
      createEditorconfigLink();
      createKytConfig();
      createPrototypeFile();
      createSrcDirectory();
      createGitignore();
      removeTmpDir();
      logger.end(`Done adding starter kyt: ${repoURL}`);
    };

    // default setup flow
    const defaultSetup = () => {
      logger.start('Setting up kyt');
      updateUserPackageJSON();
      createEditorconfigLink();
      createKytConfig();
      createGitignore();
      logger.end('Done setting up kyt');
    };

    // Checks to see if user would like src backed up before continuing
    const srcPrompt = (startSetup) => {
      const userSrcPath = path.resolve(userRootPath, './src');

      // Check if src already exists
      if (shell.test('-d', userRootPath)) {
        let question = [
        {
          type: 'confirm',
          name: 'srcBackup',
          message: 'You already have a src directory. Would you like kyt to backup src/ and continue?',
          default: true
        }
        ];
        inquire.prompt(question).then((answer) => {
          if (answer.srcBackup) {
            startSetup();
          } else {
            process.exit();
          }
        });
      } else {
        startSetup();
      }
    };

    try {
      setupPrompt();
    } catch (err) {
      bailProcess(err);
    }
  };

  simpleGit.clone(repoURL, tmpDir, {}, afterClone);
};
