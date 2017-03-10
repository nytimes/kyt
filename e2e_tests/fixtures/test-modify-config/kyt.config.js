const path = require('path');

module.exports = {
  modifyJestConfig: (config) => {
    delete config.testRegex;
    config.testMatch = ['**/?(*.)test.js'];
    return config;
  }
};
