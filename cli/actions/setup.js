
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const inquire = require('inquirer');
const simpleGit = require('simple-git')();
const logger = require('./../logger');
const semver = require('semver');
const uniq = require('ramda').uniq;
const {
  userRootPath,
  srcPath,
  userPrototypePath,
  userKytConfigPath,
  userNodeModulesPath,
  userPackageJSONPath,
} = require('../../utils/paths')(); // eslint-disable-line import/newline-after-import
// eslint-disable-next-line import/no-dynamic-require
const kytPkg = require(path.join(__dirname, '../../package.json'));

module.exports = (config, flags, args) => {
  const date = Date.now();
  const tmpDir = path.resolve(userRootPath, '\.kyt-tmp'); // eslint-disable-line no-useless-escape
  const repoURL = args.repository || 'git@github.com:NYTimes/kyt-starter-universal.git';
  const removeTmpDir = () => shell.rm('-rf', tmpDir);
  let tempPackageJSON;
  let oldPackageJSON;
  const bailProcess = (error) => {
    logger.error(`Failed to setup: ${repoURL}`);
    if (error) logger.log(error);
    removeTmpDir();
    process.exit();
  };

  // Comment the following to see verbose shell ouput.
  shell.config.silent = true;

  // Compare the Starter-kyt's package.json kyt.version
  // configuration to make sure kyt is an expected version.
  const checkStarterKytVersion = () => {
    const kytStarterVersion = (tempPackageJSON.kyt && tempPackageJSON.kyt.version) || null;
    if (kytStarterVersion) {
      if (!semver.satisfies(kytPkg.version, kytStarterVersion)) {
        // eslint-disable-next-line max-len
        logger.warn(`${tempPackageJSON.name} requires kyt version ${kytStarterVersion} but kyt ${kytPkg.version} is installed.`);
      }
    }
  };

  // Adds dependencies from the starter-kyts package.json
  const updatePackageJSONDependencies = (packageJson) => {
    const tempDependencies = tempPackageJSON.dependencies || {};

    // In case the starter kyt used `kyt` as a dependency.
    if (tempDependencies.kyt) {
      Reflect.deleteProperty(tempDependencies, 'kyt');
    }

    packageJson.dependencies = Object.assign(
      packageJson.dependencies || {},
      tempPackageJSON.dependencies
    );
    logger.task('Added new dependencies to package.json');
    return packageJson;
  };

  // Adds kyt and Starter-kyt commands as npm scripts
  const addPackageJsonScripts = (packageJson) => {
    if (!packageJson.scripts) packageJson.scripts = {};
    let commands = [
      'dev', 'build', 'start',
      'test', 'test-watch', 'test-coverage',
      'lint', 'lint-style', 'proto',
    ];

    // for commands that aren't 1:1 name:script
    const commandMap = {
      'test-watch': 'test -- --watch',
      'test-coverage': 'test -- --coverage',
    };

    // Merge the Starter-kyt script names into the list of commands.
    const tempScripts =
        (tempPackageJSON && tempPackageJSON.kyt && tempPackageJSON.kyt.scripts) || [];
    if (tempScripts.length) {
      commands = uniq(commands.concat(tempScripts));
    }

    commands.forEach((command) => {
      let commandName = command;

      // If the command already exists, we namespace it with "kyt:".
      if (packageJson.scripts[commandName]) {
        // We don't need to prefix if the command already
        // runs kyt and it's not a Starter-kyt script.
        if (packageJson.scripts[commandName].includes('kyt') && !tempScripts.indexOf(command)) {
          return;
        }
        commandName = `kyt:${commandName}`;
      }

      // If the command is from a Starter-kyt then
      // we need to copy in the Starter-kyt value.
      if (tempScripts.indexOf(command) > -1) {
        packageJson.scripts[commandName] = tempPackageJSON.scripts[command];
      } else {
        packageJson.scripts[commandName] = `kyt ${commandMap[command] || command}`;
      }
    });
    packageJson.scripts['kyt:help'] = 'kyt --help';
    logger.task('Added kyt scripts into your package.json scripts');
    return packageJson;
  };

  // Add dependencies, scripts and other package to
  // the user's package.json configuration.
  const updateUserPackageJSON = (defaultMode) => {
    let userPackageJSON;
    // Create a package.json definition if
    // the user doesn't already have one.
    if (shell.test('-f', userPackageJSONPath)) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      userPackageJSON = require(userPackageJSONPath);
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
    fs.writeFileSync(userPackageJSONPath, JSON.stringify(userPackageJSON, null, 2));
  };


  // Cleans and reinstalls node modules.
  const installUserDependencies = () => {
    logger.info('Cleaning node modules and reinstalling. This may take a couple of minutes...');
    if (shell.exec(`rm -rf ${userNodeModulesPath} && npm cache clear && npm i`).code !== 0) {
      fs.writeFileSync(userPackageJSONPath, JSON.stringify(oldPackageJSON, null, 2));
      logger.error('An error occurred when trying to install node modules');
      logger.task('Restored the original package.json and bailing');
      logger.info('You may need to reinstall your modules');
      bailProcess();
    }
    logger.task('Installed new modules');
  };

  // Create an .eslintrc in the user's base directory
  const createESLintFile = () => {
    const eslintFileName = '.eslintrc.json';
    const linkedPath = path.join(userRootPath, eslintFileName);

    // Backup esLint if it exists
    if (shell.test('-f', linkedPath)) {
      const eslintBackup = path.join(userRootPath, `${eslintFileName}-${date}.bak`);
      shell.mv(linkedPath, eslintBackup);
      logger.info(`Backed up current eslint file to: ${eslintBackup}`);
    }

    // Copy our user eslintrc into the user's root.
    const esLintPath = path.join(__dirname, '../../config/user/.eslintrc.base.json');
    if (shell.cp(esLintPath, linkedPath).code === 0) {
      logger.task(`Created ${eslintFileName} file`);
    } else {
      logger.error(`There was a problem creating ${eslintFileName}`);
    }
  };

  // Create an stylelint.json in the user's base directory.
  const createStylelintFile = () => {
    const stylelintFileName = '.stylelintrc.json';
    const userStylelintPath = path.join(userRootPath, stylelintFileName);

    // Backup the user's .stylelintrc if it exists.
    if (shell.test('-f', userStylelintPath)) {
      const stylelintBackup = path.join(userRootPath, `${stylelintFileName}-${date}.bak`);
      shell.mv(userStylelintPath, stylelintBackup);
      logger.info(`Backed up current stylelint file to: ${stylelintBackup}`);
    }

    // Copy our .stylelintrc into the user's directory
    const stylelintPath = path.join(__dirname, `../../config/user/${stylelintFileName}`);
    if (shell.cp(stylelintPath, userStylelintPath).code === 0) {
      logger.task(`Created ${stylelintFileName} file`);
    } else {
      logger.error(`There was a problem creating ${stylelintFileName}`);
    }
  };

  // .editorconfig to the user's base directory.
  const createEditorconfigLink = () => {
    const editorPath = path.join(__dirname, '../../config/user/.kyt-editorconfig');
    const configPath = path.join(userRootPath, '.editorconfig');

    // Backup existing editor config
    if (shell.test('-f', configPath)) {
      const mvTo = path.join(userRootPath, `editorconfig-${date}.bak`);
      shell.mv(configPath, mvTo);
      logger.info(`Backed up current editor config to ${mvTo}`);
    }

    shell.cp(editorPath, configPath);
    logger.task('Created .editorconfig file');
  };

  // Copies the starter kyt kyt.config.js
  // to the user's base directory.
  const createKytConfig = () => {
    const configFileName = 'kyt.config.js';
    const tmpConfig = path.join(tmpDir, configFileName);
    const baseConfig = path.join(__dirname, `../../config/user/${configFileName}`);
    let newConfig = tmpConfig;

    // Use the base kyt.config
    // if one does not exist in the starter
    if (!shell.test('-f', tmpConfig)) {
      newConfig = baseConfig;
    }

    const copyConfig = () => {
      shell.cp(newConfig, userKytConfigPath);
      logger.task(`Created ${configFileName} file`);
    };

    if (shell.test('-f', userKytConfigPath)) {
      // Since the user already has a kyt.config,
      // we need to back it up before copying.
      const mvTo = path.join(userRootPath, `${configFileName}-${date}.bak`);
      shell.mv('-f', userKytConfigPath, mvTo);
      logger.info(`Backed up current ${configFileName} to: ${mvTo}`);
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
    if (shell.test('-d', srcPath)) {
      // Since the user already has a src directory,
      // we need to make a backup before copying.
      const mvTo = path.join(userRootPath, `src-${date}-bak`);
      shell.mv('-f', srcPath, mvTo);
      logger.info(`Backed up current src directory to: ${mvTo}`);
    }

    cpSrc();
  };

  // Copies gitignore file
  const createGitignore = () => {
    const gitignoreFile = path.join(userRootPath, './.gitignore');
    if (!shell.test('-f', gitignoreFile)) {
      const gitignoreLocal = path.resolve(__dirname, '../../config/user/.kyt-gitignore');
      shell.cp(gitignoreLocal, gitignoreFile);
      logger.task('Created .gitignore file');
    }
  };

  const copyStarterKytFiles = () => {
    const kytStarterFiles = (tempPackageJSON.kyt && tempPackageJSON.kyt.files) || [];
    if (kytStarterFiles.length) {
      kytStarterFiles.forEach((file) => {
        const tempFilePath = path.join(tmpDir, file);
        const filePath = path.join(userRootPath, file);
        // If the file name isn't one of the kyt copied files then
        // we should back up any pre-existing files in the user dir.
        if (['.gitignore', '.stylelintrc.json', '.eslintrc.json', '.editorconfig']
              .indexOf(file) === -1 &&
            (shell.test('-f', filePath) || shell.test('-d', filePath))) {
          const fileBackup = path.join(userRootPath, `${file}-${date}-bak`);
          shell.mv(filePath, fileBackup);
          logger.info(`Backed up current ${file} to: ${fileBackup}`);
        }
        shell.cp('-Rf', tempFilePath, userRootPath);
        logger.task(`Copied ${file} from Starter-kyt`);
      });
    }
  };

  // Creates prototype file if one exists
  const createPrototypeFile = () => {
    const starterProto = `${tmpDir}/prototype.js`;
    // No need to copy file if it doesn't exist
    if (!shell.test('-f', starterProto)) return;
    // Backup user's prototype file if they already have one
    if (shell.test('-f', userPrototypePath)) {
      const prototypeBackup = path.join(userRootPath, `prototype-${date}.js.bak`);
      shell.mv(userPrototypePath, prototypeBackup);
      logger.info(`Backed up current prototype file to: ${prototypeBackup}`);
    }
    // Copy the prototype file from the starter kit into the users repo
    shell.cp(starterProto, userPrototypePath);
    logger.task('copied prototype.js file into root');
  };

  // setup flow for starter-kyts
  const starterKytSetup = () => {
    logger.start('Setting up starter-kyt');
    const afterClone = (error) => {
      if (error) {
        logger.error('There was a problem cloning the repository');
        logger.log(error);
        bailProcess();
      }
      // eslint-disable-next-line global-require,import/no-dynamic-require
      tempPackageJSON = require(`${tmpDir}/package.json`);
      checkStarterKytVersion();
      updateUserPackageJSON(false);
      installUserDependencies();
      createESLintFile();
      createStylelintFile();
      createEditorconfigLink();
      createKytConfig();
      createPrototypeFile();
      createSrcDirectory();
      createGitignore();
      copyStarterKytFiles();
      removeTmpDir();
      logger.end(`Done adding starter kyt: ${repoURL}`);
    };

    // First, clean any old cloned repositories.
    removeTmpDir();
    simpleGit.clone(repoURL, tmpDir, {}, afterClone);
  };

  // default setup flow
  const defaultSetup = () => {
    logger.start('Setting up kyt');
    updateUserPackageJSON(true);
    createEditorconfigLink();
    createESLintFile();
    createStylelintFile();
    createKytConfig();
    createGitignore();
    logger.end('Done setting up kyt');
  };

  // Checks to see if user would like src backed up before continuing
  const srcPrompt = (startSetup) => {
    // Check if src already exists
    if (shell.test('-d', srcPath)) {
      const question = [
        {
          type: 'confirm',
          name: 'srcBackup',
          message: 'You already have a src directory. Would you like kyt to backup src/ and continue?', // eslint-disable-line
          default: true,
        },
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

  // Selects type of setup
  const setupPrompt = () => {
    // Skip starter-kyt question if they've already supplied a repo name
    if (args.repository) {
      srcPrompt(starterKytSetup);
    } else {
      const question = [
        {
          type: 'confirm',
          name: 'setupStarter',
          message: 'Would you like to setup with the default starter-kyt?',
          default: false,
        },
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

  try {
    setupPrompt();
  } catch (err) {
    bailProcess(err);
  }
};
