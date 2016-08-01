
const shell = require('shelljs');

module.exports = (program) => {

  console.log('🔥  Starting production...');
  shell.exec('node build/server/main.js');
};
