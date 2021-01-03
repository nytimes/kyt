const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const inquire = require('inquirer');
const git = require('simple-git');
const logger = require('kyt-utils/logger');
const generatePaths = require('kyt-utils/paths');
const starterKyts = require('../../config/starterKyts');
const yarnOrNpm = require('../../utils/yarnOrNpm');
const { installUserDependencies, createDir, copyStarterKytFiles } = require('./utils');
const { fakePackageJson, updateUserPackageJSON } = require('./packages');
const { ypmQ, dirNameQ, getRepoUrl } = require('./questions');

module.exports = (cliArgs = {}) => {
  // which package manager to use
  const defaultManager = yarnOrNpm();
  // --package-manager
  let ypm = cliArgs.packageManager || defaultManager;
  // --local-path
  let localPath;
  if (cliArgs.localPath) {
    localPath = path.resolve(cliArgs.localPath);
  }

  // local vars
  let paths = {};
  let tmpDir;
  let tmpStarter;
  let tempPackageJSON;
  let oldPackageJSON;
  // For passed starter-kyts the root of the starter-kyt is the root of the repo
  let repoURL = 'https://github.com/nytimes/kyt.git';

  logger.start("Let's set up your new kyt project...");
  logger.log('✨  Answer a few questions to get started  ✨ \n');

  // Comment the following to see verbose shell ouput.
  shell.config.silent = false;

  const removeTmpStarter = () => shell.rm('-rf', tmpStarter);
  const bailProcess = error => {
    logger.error(`Failed to setup: ${repoURL}`);
    if (error) {
      logger.log(error);
    }
    removeTmpStarter();
    process.exit();
  };

  // setup tasks for starter-kyts
  const starterKytSetup = starterName => {
    let npmName;
    if (starterName) {
      npmName = starterKyts.supported[starterName].npmName;
      tmpDir = path.join(tmpDir, `/node_modules/${npmName}/starter-src`);
    }

    const kytName = starterName || localPath || repoURL;
    logger.task(`Setting up the ${starterName || 'specified'} starter-kyt`);

    // First, clean any old cloned repositories.
    removeTmpStarter();

    const afterCopy = error => {
      if (error) {
        logger.error('There was a problem downloading the starter-kyt');
        logger.log(error);
        bailProcess();
        return false;
      }
      // eslint-disable-next-line global-require,import/no-dynamic-require
      tempPackageJSON = require(`${tmpDir}/package.json`);
      ({ oldPackageJSON } = updateUserPackageJSON(paths, cliArgs.kytVersion, tempPackageJSON));
      installUserDependencies(paths, ypm, oldPackageJSON, bailProcess);
      copyStarterKytFiles(paths, tempPackageJSON, tmpDir);
      removeTmpStarter();
      logger.end(`Done adding starter kyt: ${kytName}  ✨`);
      return true;
    };

    if (localPath) {
      shell.exec(`cp -R ${localPath} ${tmpStarter}`);
      return afterCopy();
    }

    if (npmName) {
      shell.mkdir(tmpStarter);
      shell.cd(tmpStarter);
      const fakePkgPath = `${tmpStarter}/package.json`;
      fs.writeFileSync(fakePkgPath, JSON.stringify(fakePackageJson, null, 2));
      const iCmd = ypm === 'yarn' ? 'yarn add' : 'npm install';
      const output = shell.exec(`${iCmd} ${npmName}`);
      if (output.code !== 0) {
        throw output.stderr;
      }
      shell.cd('..');
      return afterCopy();
    }

    if (repoURL) {
      const simpleGit = git();
      return simpleGit.clone(repoURL, tmpStarter).then(() => {
        afterCopy();
      });
    }
    return Promise.reject(new Error('No starter-kyt specified!'));
  };

  // Runs through setup questions
  const setupPrompt = async () => {
    const ownRepo = 'I have my own url';
    const questions = [];

    // Check to see if yarn is installed or user has specified flag
    if (defaultManager === 'yarn' && !cliArgs.packageManager) {
      questions.push(ypmQ);
    }
    if (!cliArgs.directory) {
      questions.push(dirNameQ);
    }
    if (!cliArgs.repository && !localPath) {
      questions.push({
        type: 'list',
        name: 'starterChoice',
        message: 'Choose a starter-kyt:',
        choices: [...Object.keys(starterKyts.supported), ownRepo],
        default: 0,
      });
    }

    await inquire.prompt(questions).then(answer => {
      // 0-3 questions have been answered

      // if ypm question was asked and answered
      if (answer.ypm) {
        ypm = answer.ypm;
      }

      // Create new directory if --directory was passed or question was answered
      if (cliArgs.directory || answer.dirName) {
        createDir(cliArgs.directory || answer.dirName);
      }

      // set up path strings
      paths = generatePaths();
      tmpStarter = path.resolve(paths.userRootPath, '.kyt-tmp');
      // For passed starter-kyts the root of the starter-kyt is the root of the repo
      tmpDir = tmpStarter;

      if (answer.starterChoice === ownRepo || cliArgs.repository) {
        // add repo question then move on to src prompt
        return getRepoUrl(cliArgs.repository)
          .then(url => {
            repoURL = url;
            return starterKytSetup();
          })
          .catch(e => {
            logger.error(e);
            process.exit(1);
          });
      }

      if (starterKyts.supported[answer.starterChoice] || localPath) {
        return starterKytSetup(answer.starterChoice);
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
