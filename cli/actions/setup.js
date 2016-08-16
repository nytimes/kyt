
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
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
  const removeTmpDir = () => shell.exec(`rm -rf ${tmpDir}`);
  let oldPackageJSON;
  const bailProcess = (error) => {
    logger.error(`Failed to setup: ${repoURL}`);
    if (error) logger.log(error);
    removeTmpDir();
    process.exit();
  };

  // Comment the following to see verbose shell ouput.
  shell.config.silent = true;

  logger.start('Setting up kyt starter');

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
      // eslint-disable-next-line global-require
      const tempPackageJSON = require(`${tmpDir}/package.json`);
      const tempDependencies = tempPackageJSON.dependencies || {};

      // In case the starter kyt used `kyt` as a dependency.
      if (tempDependencies.kyt) delete tempDependencies.kyt;

      userPackageJSON.dependencies = Object.assign(
        userPackageJSON.dependencies || {},
        tempPackageJSON.dependencies
      );

      if (!userPackageJSON.scripts) userPackageJSON.scripts = {};
      const commands = ['dev', 'build', 'run', 'test', 'lint', 'proto'];
      commands.forEach((command) => {
        if (userPackageJSON.scripts[command]) return;
        userPackageJSON.scripts[command] = `kyt ${command}`;
      });
      userPackageJSON.scripts['kyt:help'] = ' kyt --help';

      fs.writeFileSync(packageJSONPath, JSON.stringify(userPackageJSON, null, 2));
      logger.task('Added kyt scripts into your package.json scripts');
      logger.task('Added new dependencies to package.json');
    };

    // Cleans and reinstalls node modules.
    const installUserDependencies = () => {
      logger.info('Cleaning node modules and reinstalling. This may take a couple of minutes...');
      if (shell.exec(`rm -rf ${nodeModulesPath} && npm cache clear && npm i`).code !== 0) {
        fs.writeFileSync(packageJSONPath, JSON.stringify(oldPackageJSON, null, 2));
        logger.error('An error occurred when trying to install node modules');
        logger.task('Restored the original package.json and bailing');
        logger.log('You may need to reinstall your modules');
        bailProcess();
      }
      logger.task('Installed new modules');
    };

    // Creates a symbolic link from our local
    // .babelrc to the user's base directory.
    const createBabelrcLink = () => {
      const babelrcPath = path.join(userRootPath, 'node_modules/kyt/.babelrc');
      const linkedPath = path.join(userRootPath, '.babelrc');
      if (shell.ln('-s', babelrcPath, linkedPath).code === 0) {
        logger.task('Linked .babelrc');
      }
    };


    // Create an eslint.json in the user's base directory
    const createEsLintLink = () => {
      const tmpEsLint = path.join(tmpDir, 'eslint.json');
      const linkedPath = path.join(userRootPath, 'eslint.json');

      // Backup esLint if it exists
      if(shell.test('-f', linkedPath)) {
        const eslintBackup = path.join(userRootPath, `eslint-${Date.now()}-bak.json`);
        shell.exec(`mv ${linkedPath} ${eslintBackup} `);
        logger.task(`Backed up current eslint file to: ${eslintBackup}`);
      }

      // Copy over starter-kyt esLint
      if (shell.test('-f', tmpEsLint)) {
        if (shell.cp(tmpEsLint, linkedPath).code === 0 ) {
          logger.task('Copied esLint config from starter-kyt');
        }
      } else {
        // Create a symbolic link from our local eslint
        const esLintPath = path.join(userRootPath, 'node_modules/kyt/eslint.json');
        if (shell.ln('-s', esLintPath, linkedPath).code === 0) {
          logger.task('Linked esLint config');
        }
      }
    };

    // Creates a symbolic link from our local
    // .editorconfig to the user's base directory.
    const createEditorconfigLink = () => {
      const editorPath = path.join(userRootPath, 'node_modules/kyt/.editorconfig');
      const configPath = path.join(userRootPath, '.editorconfig');
      if (shell.ln('-s', editorPath, configPath).code === 0) {
        logger.task('Linked .editorconfig');
      }
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
        shell.exec(`cp ${newConfig} ${userKytConfig}`);
        logger.task('Created new kyt.config.js');
      };
      if (shell.test('-f', userKytConfig)) {
        // Since the user already has a kyt.config,
        // we need to back it up before copying.
        const mvTo = path.join(userRootPath, `kyt.config-${Date.now()}.bak.js`);
        shell.exec(`mv -f ${userKytConfig} ${mvTo}`);
        logger.task(`Backed up current kyt.config.js to: ${mvTo}`);
        copyConfig();
      } else {
        copyConfig();
      }
    };

    // Copies the src directory from the cloned
    // repo into the user's base direcotry.
    const createSrcDirectory = () => {
      const cpSrc = () => {
        shell.exec(`cp -r ${tmpDir}/src ${userRootPath}`);
        logger.task('Created src directory');
      };
      if (shell.test('-d', userSrc)) {
        // Since the user already has a src directory,
        // we need to make a backup before copying.
        const mvTo = path.join(userRootPath, `src-${Date.now()}-bak`);
        shell.exec(`mv -f ${userSrc} ${mvTo}`);
        logger.task(`Backed up current src directory to: ${mvTo}`);
      }

      cpSrc();
    };

    const createGitignore = () => {
      if (!shell.test('-f', gitignoreFile)) {
        const gitignoreLocal = path.resolve(__dirname, '../../.gitignore');
        shell.exec(`cp ${gitignoreLocal} ${gitignoreFile}`);
        logger.task('Created .gitignore file');
      }
    };

    const createPrototypeFile = () => {
      const userProto = path.join(userRootPath, './prototype.js');
      const starterProto = `${tmpDir}/prototype.js`;
      // No need to copy file if it doesn't exist
      if (!shell.test('-f', starterProto)) return;
      // Backup user's prototype file if they already have one
      if (shell.test('-f', userProto)) {
        const prototypeBackup = path.join(userRootPath, `proto-${Date.now()}-bak.js`);
        shell.exec(`mv ${userProto} ${prototypeBackup} `);
        logger.task(`Backed up current prototype file to: ${prototypeBackup}`);
      }
      // Copy the prototype file from the starter kit into the users repo
      shell.exec(`cp ${starterProto} ${userProto}`);
      logger.task('copied prototype.js file into root');
    };

    try {
      updateUserPackageJSON();
      installUserDependencies();
      createBabelrcLink();
      createEsLintLink();
      createEditorconfigLink();
      createKytConfig();
      createPrototypeFile();
      createSrcDirectory();
      createGitignore();
      removeTmpDir();
      logger.end(`Done adding starter kyt: ${repoURL}`);
    } catch (err) {
      bailProcess(err);
    }
  };

  simpleGit.clone(repoURL, tmpDir, {}, afterClone);
};
