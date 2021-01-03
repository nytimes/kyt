const inquire = require('inquirer');

export const ypmQ = {
  type: 'list',
  name: 'ypm',
  message: 'Choose an installer',
  choices: ['npm', 'yarn'],
  default: 0,
};

export const dirNameQ = {
  type: 'input',
  name: 'dirName',
  message: 'Enter a new directory name. To install in current directory, leave blank.',
};

export const getRepoUrl = repositoryArg => {
  if (repositoryArg) {
    return Promise.resolve(repositoryArg);
  }

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
        if (answer && !answer.endsWith('.git')) {
          return 'Repository URL must end with ".git"';
        }
        return 'Please enter a valid repo url';
      },
    },
  ];

  return new Promise((resolve, reject) => {
    inquire.prompt(question).then(answer => {
      if (answer.repoUrl !== '') {
        resolve(answer.repoUrl);
      } else {
        reject(new Error('You did not enter a valid url. exiting...'));
      }
    });
  });
};

export const getSrcBackup = () => {
  const question = [
    {
      type: 'confirm',
      name: 'srcBackup',
      message: 'You already have a src directory. Would you like kyt to backup src/ and continue?',
      default: true,
    },
  ];

  return new Promise(resolve => {
    inquire.prompt(question).then(answer => {
      resolve(answer.srcBackup);
    });
  });
};
