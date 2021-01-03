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

export const createDir = dirName => {
  if (!dirName) {
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
      logger.info(`Backed up current '${file}' to: ${fileBackup}`);
    }
    shell.cp('-Rf', tempFilePath, paths.userRootPath);
    logger.task(`Copied ${file} from Starter-kyt`);
  });
};
