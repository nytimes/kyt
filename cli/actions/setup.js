
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const simpleGit = require('simple-git')();
const logger = require('./../logger');
const avaConfig = require('./../../config/ava.config');

module.exports = (program) => {
  const args = program.args[0];
  const basePath = process.cwd();
  const userSrc = path.join(basePath, 'src');
  const packageJSONPath = path.join(basePath, 'package.json');
  const nodeModulesPath = path.join(basePath, 'node_modules');
  const tmpDir = path.resolve(basePath, '\.kyt-tmp'); // eslint-disable-line no-useless-escape
  const repoURL = args.repository || 'git@github.com:nytm/wf-kyt-starter.git';
  const removeTmpDir = () => shell.exec(`rm -rf ${tmpDir}`);
  const userPackageJSON = require(packageJSONPath); // eslint-disable-line global-require
  const oldPackageJSON = Object.assign({}, userPackageJSON);
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

    // Uses the cloned package.json to update the user's
    // dependencies, scripts and other package configuration.
    const updateUserPackageJSON = () => {
      // eslint-disable-next-line global-require
      const tempPackageJSON = require(`${tmpDir}/package.json`);
      const tempDependencies = tempPackageJSON.dependencies || {};

      // Remove kyt dependency from the starter kyt package.
      if (tempDependencies.kyt) delete tempDependencies.kyt;

      userPackageJSON.dependencies = Object.assign(
        userPackageJSON.dependencies || {},
        tempPackageJSON.dependencies
      );

      userPackageJSON.ava = avaConfig;

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
      logger.task('Added ava config to package.json');
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
      const babelrcPath = path.join(basePath, 'node_modules/kyt/.babelrc');
      const linkedPath = path.join(basePath, '.babelrc');
      if (shell.ln('-s', babelrcPath, linkedPath).code === 0) {
        logger.task('Linked .babelrc');
      }
    };

    // Creates a symbolic link from our local
    // .editorconfig to the user's base directory.
    const createEditorconfigLink = () => {
      const editorPath = path.join(basePath, 'node_modules/kyt/.editorconfig');
      const configPath = path.join(basePath, '.editorconfig');
      if (shell.ln('-s', editorPath, configPath).code === 0) {
        logger.task('Linked .editorconfig');
      }
    };

    // Copies the starter kyt kyt.config.js
    // to the user's base directory.
    const createKytConfig = () => {
      const userKytConfig = path.join(basePath, 'kyt.config.js');
      const tmpConfig = path.join(tmpDir, 'kyt.config.js');
      if (!shell.test('-f', tmpConfig)) return;
      const copyConfig = () => {
        shell.exec(`cp ${tmpConfig} ${userKytConfig}`);
        logger.task('Created new kyt.config.js');
      };
      if (shell.test('-f', userKytConfig)) {
        // Since the user already has a kyt.config,
        // we need to back it up before copying.
        const mvTo = path.join(basePath, `kyt.config-${Date.now()}.bak.js`);
        shell.exec(`mv -f ${tmpConfig} ${mvTo}`);
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
        shell.exec(`cp -r ${tmpDir}/src ${basePath}`);
        logger.task('Created ./src directory');
      };
      if (shell.test('-d', userSrc)) {
        // Since the user already has a src directory,
        // we need to make a backup before copying.
        const mvTo = path.join(basePath, `src-${Date.now()}-bak`);
        shell.exec(`mv -f ${userSrc} ${mvTo}`);
        logger.task(`Backed up current src directory to: ${mvTo}`);
        cpSrc();
      } else {
        cpSrc();
      }
    };

    try {
      updateUserPackageJSON();
      installUserDependencies();
      createBabelrcLink();
      createEditorconfigLink();
      createKytConfig();
      createSrcDirectory();
      removeTmpDir();
      logger.end(`Done adding starter kyt: ${repoURL}`);
    } catch (err) {
      bailProcess(err);
    }
  };

  simpleGit.clone(repoURL, tmpDir, {}, afterClone);
};
