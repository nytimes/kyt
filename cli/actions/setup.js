
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const simpleGit = require('simple-git')();
const logger = require('./../logger');
const {
  userRootPath,
  srcPath,
  userPrototypePath,
  userKytConfigPath,
  userNodeModulesPath,
  userPackageJSONPath,
} = require('../../utils/paths')();

module.exports = (program) => {
  const args = program.args[0];

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
      if (shell.test('-f', userPackageJSONPath)) {
        userPackageJSON = require(userPackageJSONPath); // eslint-disable-line global-require
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
      if (tempDependencies.kyt) Reflect.deleteProperty(tempDependencies, 'kyt');

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

      fs.writeFileSync(userPackageJSONPath, JSON.stringify(userPackageJSON, null, 2));
      logger.task('Added kyt scripts into your package.json scripts');
      logger.task('Added new dependencies to package.json');
    };

    // Cleans and reinstalls node modules.
    const installUserDependencies = () => {
      logger.info('Cleaning node modules and reinstalling. This may take a couple of minutes...');
      if (shell.exec(`rm -rf ${userNodeModulesPath} && npm cache clear && npm i`).code !== 0) {
        fs.writeFileSync(userPackageJSONPath, JSON.stringify(oldPackageJSON, null, 2));
        logger.error('An error occurred when trying to install node modules');
        logger.task('Restored the original package.json and bailing');
        logger.log('You may need to reinstall your modules');
        bailProcess();
      }
      logger.task('Installed new modules');
    };

    // Create an eslint.json in the user's base directory
    const createESLintFile = () => {
      const tmpEsLint = path.join(tmpDir, '.eslintrc');
      const linkedPath = path.join(userRootPath, '.eslintrc');

      // Backup esLint if it exists
      if (shell.test('-f', linkedPath)) {
        const eslintBackup = path.join(userRootPath, `.eslintrc-${Date.now()}-bak.json`);
        shell.exec(`mv ${linkedPath} ${eslintBackup} `);
        logger.task(`Backed up current eslint file to: ${eslintBackup}`);
      }

      // Copy over starter-kyt esLint
      if (shell.test('-f', tmpEsLint)) {
        if (shell.cp(tmpEsLint, linkedPath).code === 0) {
          logger.task('Copied ESLint config from starter-kyt');
        }
      } else {
        // Copy our local eslint
        const esLintPath = path.join(__dirname, '../../.eslintrc');
        if (shell.cp(esLintPath, linkedPath).code === 0) {
          logger.task('Copied kyt default ESLint config');
        }
      }
    };

    // Create an stylelint.json in the user's base directory.
    const createStylelintFile = () => {
      const stylelintFileName = '.stylelintrc';
      const tmpStylelint = path.join(tmpDir, stylelintFileName);
      const userStylelintPath = path.join(userRootPath, stylelintFileName);

      // Backup the user's .stylelintrc if it exists.
      if (shell.test('-f', userStylelintPath)) {
        const stylelintBackup = path.join(userRootPath, `.stylelintrc-${Date.now()}-bak`);
        shell.exec(`mv ${userStylelintPath} ${stylelintBackup} `);
        logger.task(`Backed up current stylelint file to: ${stylelintBackup}`);
      }

      // Copy over starter-kyt .stylelintrc if it exists.
      if (shell.test('-f', tmpStylelint)) {
        if (shell.cp(tmpStylelint, userStylelintPath).code === 0) {
          logger.task('Copied Stylelint config from starter-kyt');
        }
      } else {
        // Copy our .stylelintrc into the user's directory
        const stylelintPath = path.join(__dirname, `../../config/${stylelintFileName}`);
        if (shell.cp(stylelintPath, userStylelintPath).code === 0) {
          logger.task('Copied default Stylelint config');
        }
      }
    };

    // .editorconfig to the user's base directory.
    const createEditorconfigLink = () => {
      const editorPath = './node_modules/kyt/.editorconfig';
      const configPath = path.join(userRootPath, '.editorconfig');
      if (shell.ln('-s', editorPath, configPath).code === 0) {
        logger.task('Linked .editorconfig');
      }
    };

    // Copies the starter kyt kyt.config.js
    // to the user's base directory.
    const createKytConfig = () => {
      const tmpConfig = path.join(tmpDir, 'kyt.config.js');
      const baseConfig = path.join(__dirname, '../../config/kyt.base.config.js');
      let newConfig = tmpConfig;

      // Use the base kyt.config
      // if one does not exist in the starter
      if (!shell.test('-f', tmpConfig)) {
        newConfig = baseConfig;
      }
      const copyConfig = () => {
        shell.exec(`cp ${newConfig} ${userKytConfigPath}`);
        logger.task('Created new kyt.config.js');
      };
      if (shell.test('-f', userKytConfigPath)) {
        // Since the user already has a kyt.config,
        // we need to back it up before copying.
        const mvTo = path.join(userRootPath, `kyt.config-${Date.now()}.bak.js`);
        shell.exec(`mv -f ${userKytConfigPath} ${mvTo}`);
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
      if (shell.test('-d', srcPath)) {
        // Since the user already has a src directory,
        // we need to make a backup before copying.
        const mvTo = path.join(userRootPath, `src-${Date.now()}-bak`);
        shell.exec(`mv -f ${srcPath} ${mvTo}`);
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
      const starterProto = `${tmpDir}/prototype.js`;
      // No need to copy file if it doesn't exist
      if (!shell.test('-f', starterProto)) return;
      // Backup user's prototype file if they already have one
      if (shell.test('-f', userPrototypePath)) {
        const prototypeBackup = path.join(userRootPath, `prototype-${Date.now()}-bak.js`);
        shell.exec(`mv ${userPrototypePath} ${prototypeBackup} `);
        logger.task(`Backed up current prototype file to: ${prototypeBackup}`);
      }
      // Copy the prototype file from the starter kit into the users repo
      shell.exec(`cp ${starterProto} ${userPrototypePath}`);
      logger.task('Copied prototype.js file into root');
    };

    try {
      updateUserPackageJSON();
      installUserDependencies();
      createESLintFile();
      createStylelintFile();
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
