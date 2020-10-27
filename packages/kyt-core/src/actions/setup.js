const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const inquire = require('inquirer');
const simpleGit = require('simple-git');
const logger = require('kyt-utils/logger');
const semver = require('semver');
const starterKyts = require('../config/starterKyts');
const yarnOrNpm = require('../utils/yarnOrNpm')();

const git = simpleGit();

module.exports = args => {
  logger.start("Let's set up your new kyt project...");
  logger.log('✨  Answer a few questions to get started  ✨ \n');
  // Selects package manager to use
  let ypm;
  // Comment the following to see verbose shell ouput.
  shell.config.silent = false;
  let paths = {};
  const date = Date.now();
  let tmpStarter;
  // For passed starter-kyts the root of the starter-kyt is the root of the repo
  let tmpDir;
  let repoURL = 'https://github.com/NYTimes/kyt.git';
  let { localPath } = args || {};
  let tempPackageJSON;
  let oldPackageJSON;
  const fakePackageJson = {
    name: '',
    version: '1.0.0',
    description: '',
    main: '',
    author: '',
    license: '',
  };
  const removeTmpStarter = () => shell.rm('-rf', tmpStarter);
  const bailProcess = error => {
    logger.error(`Failed to setup: ${repoURL}`);
    if (error) logger.log(error);
    removeTmpStarter();
    process.exit();
  };

  // Compare the starter-kyt's package.json kyt.version
  // configuration to make sure kyt is an expected version.
  const checkStarterKytVersion = userPackageJSON => {
    const kytStarterPreferredVersion =
      (tempPackageJSON.dependencies && tempPackageJSON.dependencies.kyt) ||
      (tempPackageJSON.devDependencies && tempPackageJSON.devDependencies.kyt) ||
      null;
    if (kytStarterPreferredVersion) {
      // Look everywhere for kyt
      const kytVersion =
        (userPackageJSON.devDependencies && userPackageJSON.devDependencies.kyt) ||
        (userPackageJSON.dependencies && userPackageJSON.dependencies.kyt);
      if (semver.valid(kytVersion)) {
        if (!semver.satisfies(kytVersion, kytStarterPreferredVersion)) {
          logger.warn(
            `${tempPackageJSON.name} requires kyt version ${kytStarterPreferredVersion} but kyt ${kytVersion} is installed.`
          );
        }
      }
    }
    return kytStarterPreferredVersion;
  };

  // Add kyt to list of dev dependencies if its not there
  const addKytDependency = (packageJson, kytPrefVersion) => {
    // check to see if kyt is in dependencies or devDependencies
    if (
      !(packageJson.dependencies && packageJson.dependencies.kyt) &&
      !(packageJson.devDependencies && packageJson.devDependencies.kyt)
    ) {
      let kytVersion = kytPrefVersion;
      // If a version wasn't specified, install latest
      if (!kytVersion) {
        const output = shell.exec('npm info kyt version');
        kytVersion = output.stdout.trim();
      }
      packageJson.dependencies = packageJson.dependencies || {};
      packageJson.dependencies.kyt = kytVersion;
    }
  };

  // Adds dependencies from the starter-kyts package.json
  const updatePackageJSONDependencies = packageJson => {
    const tempDependencies = tempPackageJSON.dependencies || {};
    const tempDevDependencies = tempPackageJSON.devDependencies || {};
    // In case the starter kyt used `kyt` as a dependency.
    if (tempDependencies.kyt) {
      delete tempDependencies.kyt;
    }
    if (tempDevDependencies.kyt) {
      delete tempDevDependencies.kyt;
    }

    packageJson.dependencies = Object.assign(packageJson.dependencies || {}, tempDependencies);

    // Copies over dev dependencies
    if (tempDevDependencies) {
      packageJson.devDependencies = Object.assign(
        packageJson.devDependencies || {},
        tempDevDependencies
      );
    }

    logger.task('Added new dependencies to package.json');
    return packageJson;
  };

  // Adds kyt and Starter-kyt commands as npm scripts
  const addPackageJsonScripts = packageJson => {
    if (!packageJson.scripts) packageJson.scripts = {};
    let commands = [
      'dev',
      'build',
      'start',
      'test',
      'test-update',
      'test-watch',
      'test-coverage',
      'lint',
      'lint-fix',
    ];

    // for commands that aren't 1:1 name:script
    const commandMap = {
      start: 'node build/server/main.js',
    };

    // Merge the Starter-kyt script names into the list of commands.
    const tempScripts =
      (tempPackageJSON && tempPackageJSON.kyt && tempPackageJSON.kyt.scripts) || [];
    if (tempScripts.length) {
      commands = [...new Set(commands.concat(tempScripts))];
    }

    // This is the default test script added by 'npm init'.
    const npmInitDefaultTestScript = 'echo "Error: no test specified" && exit 1';

    commands.forEach(command => {
      let commandName = command;

      // If the command already exists, we namespace it with "kyt:".
      if (packageJson.scripts[commandName]) {
        // We don't need to prefix if the command already
        // runs kyt and it's not a Starter-kyt script.
        if (packageJson.scripts[commandName].includes('kyt') && !tempScripts.indexOf(command)) {
          return;
        }

        // Prefix except for when the command is 'test' and the script is
        // the default from 'npm init'.
        if (
          commandName !== 'test' ||
          packageJson.scripts[commandName] !== npmInitDefaultTestScript
        ) {
          commandName = `kyt:${commandName}`;
        }
      }

      // If the command is from a starter-kyt then
      // we need to copy in the starter-kyt value.
      if (tempScripts.indexOf(command) > -1) {
        packageJson.scripts[commandName] = tempPackageJSON.scripts[command];
      } else {
        packageJson.scripts[commandName] = commandMap[command] || `kyt ${command}`;
      }
    });
    packageJson.scripts['kyt:help'] = 'kyt --help';
    logger.task('Added kyt scripts into your package.json scripts');
    return packageJson;
  };

  const { kytVersion, packageManager, directory, repository } = args || {};

  // Add dependencies, scripts and other package to
  // the user's package.json configuration.
  const updateUserPackageJSON = existingProject => {
    let userPackageJSON;
    // Create a package.json definition if
    // the user doesn't already have one.
    if (shell.test('-f', paths.userPackageJSONPath)) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      userPackageJSON = require(paths.userPackageJSONPath);
    } else {
      userPackageJSON = fakePackageJson;
      logger.task('Creating a new package.json. You should fill it in.');
    }
    // Clone the package.json so that we have a backup.
    oldPackageJSON = { ...userPackageJSON };

    // Add dependencies from starter-kyts
    if (!existingProject) {
      const kytPrefVersion = kytVersion || checkStarterKytVersion(userPackageJSON);
      userPackageJSON = updatePackageJSONDependencies(userPackageJSON);
      addKytDependency(userPackageJSON, kytPrefVersion);
    } else {
      // exisitng projects should also have kyt as a devDependency
      addKytDependency(userPackageJSON);
    }
    // Add scripts
    userPackageJSON = addPackageJsonScripts(userPackageJSON);
    fs.writeFileSync(paths.userPackageJSONPath, JSON.stringify(userPackageJSON, null, 2));
  };

  // Cleans and reinstalls node modules.
  const installUserDependencies = () => {
    logger.info('Cleaning node modules and reinstalling. This may take a couple of minutes...');
    // shell.rm('-rf', paths.userNodeModulesPath);
    const result = shell.exec(`${ypm} install`);
    if (result.code !== 0) {
      fs.writeFileSync(paths.userPackageJSONPath, JSON.stringify(oldPackageJSON, null, 2));
      logger.error('An error occurred when trying to install node modules', result.stderr);
      logger.task('Restored the original package.json and bailing');
      logger.info('You may need to reinstall your modules');
      bailProcess();
    }
    logger.task('Installed new modules');
  };

  // .editorconfig to the user's base directory.
  const createEditorconfigLink = () => {
    const editorPath = path.join(__dirname, '../config/user/.kyt-editorconfig');
    const configPath = path.join(paths.userRootPath, '.editorconfig');

    // Backup existing editor config
    if (shell.test('-f', configPath)) {
      const mvTo = path.join(paths.userRootPath, `editorconfig-${date}.bak`);
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
    const baseConfig = path.join(__dirname, `../config/user/${configFileName}`);
    let newConfig = tmpConfig;

    // Use the base kyt.config
    // if one does not exist in the starter
    if (!shell.test('-f', tmpConfig)) {
      newConfig = baseConfig;
    }

    const copyConfig = () => {
      shell.cp(newConfig, paths.userKytConfigPath);
      logger.task(`Created ${configFileName} file`);
    };

    if (shell.test('-f', paths.userKytConfigPath)) {
      // Since the user already has a kyt.config,
      // we need to back it up before copying.
      const mvTo = path.join(paths.userRootPath, `${configFileName}-${date}.bak`);
      shell.mv('-f', paths.userKytConfigPath, mvTo);
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
      const tmpSrcPath = path.join(tmpDir, '/src');
      shell.cp('-r', `${tmpSrcPath}`, paths.userRootPath);
      logger.task('Created src directory');
    };
    if (shell.test('-d', paths.srcPath)) {
      // Since the user already has a src directory,
      // we need to make a backup before copying.
      const mvTo = path.join(paths.userRootPath, `src-${date}-bak`);
      shell.mv('-f', paths.srcPath, mvTo);
      logger.info(`Backed up current src directory to: ${mvTo}`);
    }

    cpSrc();
  };

  // Copies gitignore file
  const createGitignore = () => {
    const gitignoreFile = path.join(paths.userRootPath, './.gitignore');
    if (!shell.test('-f', gitignoreFile)) {
      const gitignoreLocal = path.resolve(__dirname, '../config/user/.kyt-gitignore');
      shell.cp(gitignoreLocal, gitignoreFile);
      logger.task('Created .gitignore file');
    }
  };

  const copyStarterKytFiles = () => {
    const kytStarterFiles = (tempPackageJSON.kyt && tempPackageJSON.kyt.files) || [];
    if (kytStarterFiles.length) {
      kytStarterFiles.forEach(file => {
        const tempFilePath = path.join(tmpDir, file);
        const filePath = path.join(paths.userRootPath, file);
        // If the file name isn't one of the kyt copied files then
        // we should back up any pre-existing files in the user dir.
        if (
          ['.gitignore', '.editorconfig', 'kyt.config.js'].indexOf(file) === -1 &&
          (shell.test('-f', filePath) || shell.test('-d', filePath))
        ) {
          const fileBackup = path.join(paths.userRootPath, `${file}-${date}-bak`);
          shell.mv(filePath, fileBackup);
          logger.info(`Backed up current ${file} to: ${fileBackup}`);
        }
        shell.cp('-Rf', tempFilePath, paths.userRootPath);
        logger.task(`Copied ${file} from Starter-kyt`);
      });
    }
  };

  // setup tasks for starter-kyts
  const starterKytSetup = starterName => {
    let npmName = null;
    if (starterName) {
      // eslint-disable-next-line prefer-destructuring
      npmName = starterKyts.supported[starterName].npmName;
      tmpDir = path.join(tmpDir, `/node_modules/${npmName}/starter-src`);
    }

    const kytName = starterName || localPath || repoURL;
    starterName = starterName || 'specified';
    logger.task(`Setting up the ${starterName} starter-kyt`);

    const afterCopy = error => {
      if (error) {
        logger.error('There was a problem downloading the starter-kyt');
        logger.log(error);
        bailProcess();
      }
      // eslint-disable-next-line global-require,import/no-dynamic-require
      tempPackageJSON = require(`${tmpDir}/package.json`);
      updateUserPackageJSON(false);
      installUserDependencies();
      createEditorconfigLink();
      createKytConfig();
      createSrcDirectory();
      createGitignore();
      copyStarterKytFiles();
      removeTmpStarter();
      logger.end(`Done adding starter kyt: ${kytName}  ✨`);
    };

    // First, clean any old cloned repositories.
    removeTmpStarter();

    if (localPath) {
      shell.exec(`cp -R ${localPath} ${tmpStarter}`);
      afterCopy();
    } else if (npmName) {
      shell.mkdir(tmpStarter);
      shell.cd(tmpStarter);
      const fakePkgPath = `${tmpStarter}/package.json`;
      fs.writeFileSync(fakePkgPath, JSON.stringify(fakePackageJson, null, 2));
      let iCmd = 'npm install';
      if (ypm === 'yarn') {
        iCmd = 'yarn add';
      }
      const output = shell.exec(`${iCmd} ${npmName}@next`);
      if (output.code !== 0) {
        throw output.stderr;
      }
      shell.cd('..');
      afterCopy();
    } else {
      git.clone(repoURL, tmpStarter).then(() => afterCopy());
    }
  };

  // Checks to see if user would like src backed up before continuing
  const srcPrompt = starterChoice => {
    // Check if src already exists
    if (shell.test('-d', paths.srcPath)) {
      const question = [
        {
          type: 'confirm',
          name: 'srcBackup',
          message:
            'You already have a src directory. Would you like kyt to backup src/ and continue?',
          default: true,
        },
      ];
      inquire.prompt(question).then(answer => {
        if (answer.srcBackup) {
          starterKytSetup(starterChoice);
        } else {
          process.exit();
        }
      });
    } else {
      starterKytSetup(starterChoice);
    }
  };

  // setup tasks for setup in existing project
  const existingProjectSetup = () => {
    logger.start('Setting up kyt');
    updateUserPackageJSON(true);
    createEditorconfigLink();
    createKytConfig();
    createGitignore();
    logger.end('Done setting up kyt');
  };

  const getRepoUrl = repositoryArg => {
    if (repositoryArg) {
      repoURL = repositoryArg;
      srcPrompt();
    } else {
      const question = [
        {
          type: 'input',
          name: 'repoUrl',
          message: 'Enter your Repo URL (https or ssh)',
          validate: answer => {
            const httpsPass = answer.match(/^https:\/\/.*.git$/);
            const sshPass = answer.match(/^git@github.com:.*.git$/);
            if (httpsPass || sshPass) {
              return true;
            }
            return 'Please enter a valid repo url';
          },
        },
      ];
      inquire.prompt(question).then(answer => {
        if (answer.repoUrl !== '') {
          repoURL = answer.repoUrl;
          srcPrompt();
        } else {
          logger.error('You did not enter a valid url. exiting...');
          process.exit(1);
        }
      });
    }
  };

  const createDir = dirName => {
    if (dirName === '') return;
    const checkAndBail = code => {
      if (code) {
        logger.error(`Unable to create directory ${dirName}. Exiting...`);
        process.exit(1);
      }
    };
    // Creates project directory if one is specified
    logger.task(`Creating your new project at ${dirName}`);
    let output = shell.mkdir(dirName);
    checkAndBail(output.code);
    output = shell.cd(dirName);
    checkAndBail(output.code);
  };

  const setupPaths = () => {
    paths = require('kyt-utils/paths')(); // eslint-disable-line global-require
    tmpStarter = path.resolve(paths.userRootPath, '.kyt-tmp');
    // For passed starter-kyts the root of the starter-kyt is the root of the repo
    tmpDir = tmpStarter;
    repoURL = 'https://github.com/NYTimes/kyt.git';
  };

  // Runs through setup questions
  const setupPrompt = () => {
    const skList = Object.keys(starterKyts.supported);
    const ownRepo = 'I have my own url';
    const exist = "I don't want a starter-kyt";
    skList.push(ownRepo);
    skList.push(exist);
    const ypmQ = {
      type: 'list',
      name: 'ypm',
      message: 'Choose an installer',
      choices: ['npm', 'yarn'],
      default: 0,
    };
    const dirNameQ = {
      type: 'input',
      name: 'dirName',
      message: 'Enter a new directory name. To install in current directory, leave blank.',
    };

    const skQ = {
      type: 'list',
      name: 'starterChoice',
      message: 'Choose a starter-kyt:',
      choices: skList,
      default: 0,
    };
    const questions = [];

    // Check to see if yarn is installed or user has specified flag
    if (yarnOrNpm === 'yarn' && !packageManager) questions.push(ypmQ);
    ypm = packageManager || yarnOrNpm;
    if (!directory) questions.push(dirNameQ);
    if (!repository && !localPath) questions.push(skQ);

    inquire.prompt(questions).then(answer => {
      // question 1
      ypm = answer.ypm || ypm;
      // question 2
      // Save Local directory Path before moving to new directory
      if (localPath) {
        localPath = path.resolve(localPath);
      }
      // Create new directory and set up path strings
      createDir(directory || answer.dirName);
      setupPaths();
      // question 3
      const choice = answer.starterChoice;
      if (choice === ownRepo || repository) {
        // add repo question then move on to src prompt
        getRepoUrl(repository);
      } else if (starterKyts.supported[choice] || localPath) {
        srcPrompt(choice);
      } else if (choice === exist) {
        existingProjectSetup();
      }
    });
  };

  try {
    setupPrompt();
  } catch (err) {
    bailProcess(err);
  }
};
