const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const logger = require('kyt-utils/logger');

// Cleans and reinstalls node modules.
export const installUserDependencies = (paths, ypm, oldPackageJSON, bailProcess) => {
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
export const createEditorconfigLink = paths => {
  const editorPath = path.join(__dirname, '../config/user/.kyt-editorconfig');
  const configPath = path.join(paths.userRootPath, '.editorconfig');

  // Backup existing editor config
  if (shell.test('-f', configPath)) {
    const mvTo = path.join(paths.userRootPath, `editorconfig-${Date.now()}.bak`);
    shell.mv(configPath, mvTo);
    logger.info(`Backed up current editor config to ${mvTo}`);
  }

  shell.cp(editorPath, configPath);
  logger.task('Created .editorconfig file');
};

// Copies gitignore file
export const createGitignore = paths => {
  const gitignoreFile = path.join(paths.userRootPath, './.gitignore');
  if (!shell.test('-f', gitignoreFile)) {
    const gitignoreLocal = path.resolve(__dirname, '../config/user/.kyt-gitignore');
    shell.cp(gitignoreLocal, gitignoreFile);
    logger.task('Created .gitignore file');
  }
};

// Copies the starter kyt kyt.config.js
// to the user's base directory.

export const createKytConfig = (paths, tmpDir) => {
  const configFileName = 'kyt.config.js';
  const tmpConfig = path.join(tmpDir, configFileName);
  const baseConfig = path.join(__dirname, `../config/user/${configFileName}`);
  let newConfig = tmpConfig;

  // Use the base kyt.config
  // if one does not exist in the starter
  if (!shell.test('-f', tmpConfig)) {
    newConfig = baseConfig;
  }

  if (shell.test('-f', paths.userKytConfigPath)) {
    // Since the user already has a kyt.config,
    // we need to back it up before copying.
    const mvTo = path.join(paths.userRootPath, `${configFileName}-${Date.now()}.bak`);
    shell.mv('-f', paths.userKytConfigPath, mvTo);
    logger.info(`Backed up current ${configFileName} to: ${mvTo}`);
  }
  shell.cp(newConfig, paths.userKytConfigPath);
  logger.task(`Created ${configFileName} file`);
};

export const createDir = dirName => {
  if (dirName === '') {
    return;
  }

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

export const copyStarterKytFiles = (paths, tempPackageJSON, tmpDir) => {
  const kytStarterFiles = (tempPackageJSON.kyt && tempPackageJSON.kyt.files) || [];
  if (kytStarterFiles.length === 0) {
    return;
  }

  kytStarterFiles.forEach(file => {
    const tempFilePath = path.join(tmpDir, file);
    const filePath = path.join(paths.userRootPath, file);
    // If the file name isn't one of the kyt copied files then
    // we should back up any pre-existing files in the user dir.
    if (
      ['.gitignore', '.editorconfig', 'kyt.config.js'].indexOf(file) === -1 &&
      (shell.test('-f', filePath) || shell.test('-d', filePath))
    ) {
      const fileBackup = path.join(paths.userRootPath, `${file}-${Date.now()}-bak`);
      shell.mv(filePath, fileBackup);
      logger.info(`Backed up current ${file} to: ${fileBackup}`);
    }
    shell.cp('-Rf', tempFilePath, paths.userRootPath);
    logger.task(`Copied ${file} from Starter-kyt`);
  });
};

// Copies the src directory from the cloned
// repo into the user's base direcotry.
export const createSrcDirectory = (paths, tmpDir) => {
  if (shell.test('-d', paths.srcPath)) {
    // Since the user already has a src directory,
    // we need to make a backup before copying.
    const mvTo = path.join(paths.userRootPath, `src-${Date.now()}-bak`);
    shell.mv('-f', paths.srcPath, mvTo);
    logger.info(`Backed up current src directory to: ${mvTo}`);
  }

  const tmpSrcPath = path.join(tmpDir, '/src');
  shell.cp('-r', `${tmpSrcPath}`, paths.userRootPath);
  logger.task('Created src directory');
};
