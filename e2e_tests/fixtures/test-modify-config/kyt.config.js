const path = require('path');

module.exports = {
  modifyJestConfig: config => {
    delete config.testRegex;
    config.testRegex = '(.*(blargh|spec))\\.js$';
    return config;
  },
};
