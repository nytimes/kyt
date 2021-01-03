const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const inquire = require('inquirer');
const git = require('simple-git');
const logger = require('kyt-utils/logger');
const starterKyts = require('../../config/starterKyts');
const yarnOrNpm = require('../../utils/yarnOrNpm')();
const {
  installUserDependencies,
  createDir,
  copyStarterKytFiles,
  createSrcDirectory,
} = require('./utils');
const { fakePackageJson, updateUserPackageJSON } = require('./packages');
const { ypmQ, dirNameQ, getRepoUrl, getSrcBackup } = require('./questions');

module.exports = args => {
  logger.start("Let's set up your new kyt project...");
  logger.log('✨  Answer a few questions to get started  ✨ \n');
  // Selects package manager to use
  let ypm;
  // Comment the following to see verbose shell ouput.
  shell.config.silent = false;
  let paths = {};
  let tmpStarter;
  // For passed starter-kyts the root of the starter-kyt is the root of the repo
  let tmpDir;
  let repoURL = 'https://github.com/NYTimes/kyt.git';
  let { localPath } = args || {};
  let tempPackageJSON;
  let oldPackageJSON;

  const removeTmpStarter = () => shell.rm('-rf', tmpStarter);
  const bailProcess = error => {
    logger.error(`Failed to setup: ${repoURL}`);
    if (error) logger.log(error);
    removeTmpStarter();
    process.exit();
  };

  const { kytVersion, packageManager, directory, repository } = args || {};

  // setup tasks for starter-kyts
  const starterKytSetup = starterName => {
    let npmName = null;
    if (starterName) {
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
      ({ oldPackageJSON } = updateUserPackageJSON(false, paths, kytVersion, tempPackageJSON));
      installUserDependencies(paths, ypm, oldPackageJSON, bailProcess);
      createSrcDirectory(paths, tmpDir);
      copyStarterKytFiles(paths, tempPackageJSON, tmpDir);
      removeTmpStarter();
      logger.end(`Done adding starter kyt: ${kytName}  ✨`);
      return true;
    };

    // First, clean any old cloned repositories.
    removeTmpStarter();

    if (localPath) {
      shell.exec(`cp -R ${localPath} ${tmpStarter}`);
      return afterCopy();
    }

    if (npmName) {
      shell.mkdir(tmpStarter);
      shell.cd(tmpStarter);
      const fakePkgPath = `${tmpStarter}/package.json`;
      fs.writeFileSync(fakePkgPath, JSON.stringify(fakePackageJson, null, 2));
      let iCmd = 'npm install';
      if (ypm === 'yarn') {
        iCmd = 'yarn add';
      }
      const output = shell.exec(`${iCmd} ${npmName}`);
      if (output.code !== 0) {
        throw output.stderr;
      }
      shell.cd('..');
      return afterCopy();
    }

    const simpleGit = git();
    return simpleGit.clone(repoURL, tmpStarter).then(() => {
      afterCopy();
    });
  };

  // Checks to see if user would like src backed up before continuing
  const srcPrompt = starterChoice => {
    // Check if src already exists
    if (shell.test('-d', paths.srcPath)) {
      return getSrcBackup().then(srcBackup => {
        if (srcBackup) {
          return starterKytSetup(starterChoice);
        }
        return process.exit();
      });
    }
    return starterKytSetup(starterChoice);
  };

  // Runs through setup questions
  const setupPrompt = async () => {
    const skList = Object.keys(starterKyts.supported);
    const ownRepo = 'I have my own url';
    const exist = "I don't want a starter-kyt";
    skList.push(ownRepo);
    skList.push(exist);

    const skQ = {
      type: 'list',
      name: 'starterChoice',
      message: 'Choose a starter-kyt:',
      choices: skList,
      default: 0,
    };
    const questions = [];

    // Check to see if yarn is installed or user has specified flag
    if (yarnOrNpm === 'yarn' && !packageManager) {
      questions.push(ypmQ);
    }
    ypm = packageManager || yarnOrNpm;
    if (!directory) {
      questions.push(dirNameQ);
    }
    if (!repository && !localPath) {
      questions.push(skQ);
    }

    await inquire.prompt(questions).then(answer => {
      // question 1
      ypm = answer.ypm || ypm;

      // question 2
      // Save Local directory Path before moving to new directory
      if (localPath) {
        localPath = path.resolve(localPath);
      }
      // Create new directory
      createDir(directory || answer.dirName);

      // set up path strings
      // eslint-disable-next-line global-require
      paths = require('kyt-utils/paths')();
      tmpStarter = path.resolve(paths.userRootPath, '.kyt-tmp');

      // For passed starter-kyts the root of the starter-kyt is the root of the repo
      tmpDir = tmpStarter;
      repoURL = 'https://github.com/NYTimes/kyt.git';

      // question 3
      if (answer.starterChoice === ownRepo || repository) {
        // add repo question then move on to src prompt
        return getRepoUrl(repository)
          .then(url => {
            repoURL = url;
            return srcPrompt();
          })
          .catch(e => {
            logger.error(e);
            process.exit(1);
          });
      }

      if (starterKyts.supported[answer.starterChoice] || localPath) {
        return srcPrompt(answer.starterChoice);
      }

      if (answer.starterChoice === exist) {
        // setup tasks for setup in existing project
        logger.start('Setting up kyt');
        updateUserPackageJSON(true, paths, kytVersion, tempPackageJSON);
        logger.end('Done setting up kyt');
      }

      return undefined;
    });
  };

  try {
    setupPrompt();
  } catch (err) {
    bailProcess(err);
  }
};
